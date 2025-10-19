import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

/**
 * POST /api/cart/items
 * Agrega un producto al carrito (requiere autenticación)
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const userId = locals.user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para agregar productos al carrito'
      }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return json({
        success: false,
        error: 'ID de producto requerido'
      }, { status: 400 });
    }

    if (!quantity || quantity < 1) {
      return json({
        success: false,
        error: 'Cantidad válida es requerida (mínimo 1)'
      }, { status: 400 });
    }

    // Verificar que el producto existe y está activo
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

    // Verificar stock disponible
    if (quantity > product.stock) {
      return json({
        success: false,
        error: `Stock insuficiente. Disponible: ${product.stock}`
      }, { status: 400 });
    }

    // Obtener o crear carrito del usuario
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true }
      });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      // Si ya existe, actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;

      // Verificar stock nuevamente
      if (newQuantity > product.stock) {
        return json({
          success: false,
          error: `Stock insuficiente. Disponible: ${product.stock}, solicitado: ${newQuantity}`
        }, { status: 400 });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });

      // Actualizar timestamp del carrito
      await prisma.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() }
      });

      return json({
        success: true,
        message: 'Cantidad actualizada en el carrito',
        data: {
          id: updatedItem.id,
          productId: updatedItem.productId,
          quantity: updatedItem.quantity,
          product: {
            id: updatedItem.product.id,
            name: updatedItem.product.name,
            price: updatedItem.product.price,
            stock: updatedItem.product.stock,
            category: updatedItem.product.category,
            imageUrl: updatedItem.product.imageUrl
          }
        }
      });
    } else {
      // Si no existe, crear nuevo item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        },
        include: { product: true }
      });

      // Actualizar timestamp del carrito
      await prisma.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() }
      });

      return json({
        success: true,
        message: 'Producto agregado al carrito',
        data: {
          id: newItem.id,
          productId: newItem.productId,
          quantity: newItem.quantity,
          product: {
            id: newItem.product.id,
            name: newItem.product.name,
            price: newItem.product.price,
            stock: newItem.product.stock,
            category: newItem.product.category,
            imageUrl: newItem.product.imageUrl
          }
        }
      });
    }

  } catch (error) {
    console.error('Error agregando al carrito:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
};
