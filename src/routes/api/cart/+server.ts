import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

// Helper para obtener carrito del usuario autenticado (requiere registro)
async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { product: true } } }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId
      },
      include: { items: { include: { product: true } } }
    });
  }

  return cart;
}

// Helper para calcular totales
function calculateTotals(items: Array<{ product: { price: Decimal }; quantity: number }>) {
  const subtotal = items.reduce((sum: number, item: { product: { price: Decimal }; quantity: number }) => {
    return sum + (Number(item.product.price) * item.quantity);
  }, 0);

  const tax = subtotal * 0.21; // IVA 21%
  const total = subtotal + tax;

  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  };
}

/**
 * GET /api/cart
 * Obtiene el carrito actual del usuario (requiere autenticación)
 */
export const GET: RequestHandler = async ({ locals }) => {
  try {
    const userId = (locals as any).user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para acceder al carrito'
      }, { status: 401 });
    }

    const cart = await getOrCreateCart(userId);

    if (!cart || cart.items.length === 0) {
      return json({
        success: true,
        data: {
          id: cart?.id || null,
          items: [],
          totals: { subtotal: '0.00', tax: '0.00', total: '0.00' }
        }
      });
    }

    const totals = calculateTotals(cart.items);

    return json({
      success: true,
      data: {
        id: cart.id,
        items: cart.items.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            stock: item.product.stock,
            category: item.product.category,
            imageUrl: item.product.imageUrl,
            isActive: item.product.isActive
          }
        })),
        totals
      }
    });

  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
};

/**
 * POST /api/cart/items
 * Agrega un producto al carrito (requiere autenticación)
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const userId = (locals as any).user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para agregar productos al carrito'
      }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId || quantity < 1) {
      return json({
        success: false,
        error: 'Producto ID y cantidad válidos son requeridos'
      }, { status: 400 });
    }

    // Verificar que el producto existe y está disponible
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return json({
        success: false,
        error: 'Producto no encontrado'
      }, { status: 404 });
    }

    if (!product.isActive) {
      return json({
        success: false,
        error: 'Producto no disponible'
      }, { status: 400 });
    }

    if (product.stock < quantity) {
      return json({
        success: false,
        error: `Stock insuficiente. Disponible: ${product.stock}`
      }, { status: 400 });
    }

    const cart = await getOrCreateCart(userId);

    // Verificar si el producto ya está en el carrito
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    let cartItem;

    if (existingItem) {
      // Actualizar cantidad existente
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return json({
          success: false,
          error: `Stock insuficiente. Disponible: ${product.stock}`
        }, { status: 400 });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });
    } else {
      // Crear nuevo item en el carrito
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        },
        include: { product: true }
      });
    }

    // Actualizar timestamp del carrito
    await prisma.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() }
    });

    return json({
      success: true,
      message: existingItem ? 'Cantidad actualizada' : 'Producto agregado al carrito',
      data: {
        id: cartItem.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        product: {
          id: cartItem.product.id,
          name: cartItem.product.name,
          price: cartItem.product.price,
          stock: cartItem.product.stock,
          category: cartItem.product.category,
          imageUrl: cartItem.product.imageUrl
        }
      }
    });

  } catch (error) {
    console.error('Error agregando al carrito:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
};

/**
 * DELETE /api/cart
 * Vacía completamente el carrito (requiere autenticación)
 */
export const DELETE: RequestHandler = async ({ locals }) => {
  try {
    const userId = (locals as any).user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para vaciar el carrito'
      }, { status: 401 });
    }

    // Verificar si el carrito existe
    const cart = await prisma.cart.findUnique({
      where: { id: userId },
      include: { items: true }
    });

    if (!cart) {
      return json({
        success: true,
        message: 'Carrito ya estaba vacío'
      });
    }

    // Eliminar todos los items del carrito
    await prisma.cartItem.deleteMany({
      where: { cartId: userId }
    });

    // Eliminar el carrito si queda vacío
    await prisma.cart.delete({
      where: { id: userId }
    });

    return json({
      success: true,
      message: 'Carrito vaciado completamente'
    });

  } catch (error) {
    console.error('Error vaciando carrito:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
};
