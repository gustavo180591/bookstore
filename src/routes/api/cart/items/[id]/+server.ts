import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

/**
 * PUT /api/cart/items/[id]
 * Actualiza la cantidad de un item en el carrito (requiere autenticación)
 */
export const PUT: RequestHandler = async ({ params, request, locals }) => {
  try {
    const userId = (locals as any).user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para modificar el carrito'
      }, { status: 401 });
    }

    const { id } = params;
    const { quantity } = await request.json();

    if (!quantity || quantity < 1) {
      return json({
        success: false,
        error: 'Cantidad válida es requerida'
      }, { status: 400 });
    }

    // Obtener el item del carrito y verificar que pertenece al usuario
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId
        }
      },
      include: { product: true, cart: true }
    });

    if (!cartItem) {
      return json({
        success: false,
        error: 'Item no encontrado en el carrito'
      }, { status: 404 });
    }

    // Verificar stock disponible
    if (quantity > cartItem.product.stock) {
      return json({
        success: false,
        error: `Stock insuficiente. Disponible: ${cartItem.product.stock}`
      }, { status: 400 });
    }

    // Si la cantidad es 0, eliminar el item
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id }
      });

      // Verificar si el carrito queda vacío
      const remainingItems = await prisma.cartItem.count({
        where: { cartId: cartItem.cartId }
      });

      if (remainingItems === 0) {
        await prisma.cart.delete({
          where: { id: cartItem.cartId }
        });
      }

      return json({
        success: true,
        message: 'Producto removido del carrito'
      });
    }

    // Actualizar cantidad
    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true }
    });

    // Actualizar timestamp del carrito
    await prisma.cart.update({
      where: { id: cartItem.cartId },
      data: { updatedAt: new Date() }
    });

    return json({
      success: true,
      message: 'Cantidad actualizada',
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

  } catch (error) {
    console.error('Error actualizando carrito:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
};

/**
 * DELETE /api/cart/items/[id]
 * Remueve un item del carrito (requiere autenticación)
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
  try {
    const userId = (locals as any).user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para modificar el carrito'
      }, { status: 401 });
    }

    const { id } = params;

    // Obtener el item para conocer el cartId y verificar que pertenece al usuario
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId
        }
      },
      include: { cart: true }
    });

    if (!cartItem) {
      return json({
        success: false,
        error: 'Item no encontrado en el carrito'
      }, { status: 404 });
    }

    // Eliminar el item
    await prisma.cartItem.delete({
      where: { id }
    });

    // Verificar si el carrito queda vacío
    const remainingItems = await prisma.cartItem.count({
      where: { cartId: cartItem.cartId }
    });

    if (remainingItems === 0) {
      await prisma.cart.delete({
        where: { id: cartItem.cartId }
      });

      return json({
        success: true,
        message: 'Producto removido y carrito eliminado (estaba vacío)'
      });
    }

    // Actualizar timestamp del carrito
    await prisma.cart.update({
      where: { id: cartItem.cartId },
      data: { updatedAt: new Date() }
    });

    return json({
      success: true,
      message: 'Producto removido del carrito'
    });

  } catch (error) {
    console.error('Error removiendo del carrito:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
};
