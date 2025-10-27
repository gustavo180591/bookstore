import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CartService } from '$lib/server/services/cartService';

/**
 * PUT /api/cart/items/[id]
 * Actualiza la cantidad de un item en el carrito con reservas de stock (requiere autenticación)
 */
export const PUT: RequestHandler = async ({ params, request, locals }) => {
  try {
    const userId = locals.user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para modificar el carrito'
      }, { status: 401 });
    }

    const { id } = params;
    const { quantity } = await request.json();

    if (!quantity || quantity < 0) {
      return json({
        success: false,
        error: 'Cantidad válida es requerida (0 para eliminar)'
      }, { status: 400 });
    }

    // Obtener el item del carrito para conocer el productId
    const cartItem = await import('$lib/server/prisma').then(({ default: prisma }) =>
      prisma.cartItem.findFirst({
        where: {
          id,
          cart: {
            userId
          }
        },
        include: { product: true }
      })
    );

    if (!cartItem) {
      return json({
        success: false,
        error: 'Item no encontrado en el carrito'
      }, { status: 404 });
    }

    let result;

    if (quantity === 0) {
      // Remover item del carrito
      result = await CartService.removeFromCart(userId, cartItem.productId);
    } else {
      // Actualizar cantidad
      result = await CartService.updateCartItem(userId, cartItem.productId, quantity);
    }

    if (!result.success) {
      return json({
        success: false,
        error: result.message
      }, { status: 400 });
    }

    return json({
      success: true,
      message: quantity === 0 ? 'Producto removido del carrito' : 'Cantidad actualizada',
      data: result.cart ? {
        id: result.cart.id,
        items: result.cart.items.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          reserved: result.cart?.stockReservations.find(r => r.productId === item.productId)?.quantity || 0,
          expiresAt: result.cart?.stockReservations.find(r => r.productId === item.productId)?.expiresAt || null,
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
        totals: result.cart ? {
          subtotal: result.cart.items.reduce((sum, item) =>
            sum + (Number(item.product.price) * item.quantity), 0).toFixed(2),
          tax: (result.cart.items.reduce((sum, item) =>
            sum + (Number(item.product.price) * item.quantity), 0) * 0.21).toFixed(2),
          total: (result.cart.items.reduce((sum, item) =>
            sum + (Number(item.product.price) * item.quantity), 0) * 1.21).toFixed(2)
        } : { subtotal: '0.00', tax: '0.00', total: '0.00' }
      } : null
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
 * Remueve un item del carrito y libera su reserva (requiere autenticación)
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
  try {
    const userId = locals.user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para modificar el carrito'
      }, { status: 401 });
    }

    const { id } = params;

    // Obtener el item para conocer el productId
    const cartItem = await import('$lib/server/prisma').then(({ default: prisma }) =>
      prisma.cartItem.findFirst({
        where: {
          id,
          cart: {
            userId
          }
        },
        include: { product: true }
      })
    );

    if (!cartItem) {
      return json({
        success: false,
        error: 'Item no encontrado en el carrito'
      }, { status: 404 });
    }

    const result = await CartService.removeFromCart(userId, cartItem.productId);

    return json({
      success: true,
      message: result.message,
      data: result.cart ? {
        id: result.cart.id,
        items: result.cart.items.map(item => ({
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
        totals: {
          subtotal: result.cart.items.reduce((sum, item) =>
            sum + (Number(item.product.price) * item.quantity), 0).toFixed(2),
          tax: (result.cart.items.reduce((sum, item) =>
            sum + (Number(item.product.price) * item.quantity), 0) * 0.21).toFixed(2),
          total: (result.cart.items.reduce((sum, item) =>
            sum + (Number(item.product.price) * item.quantity), 0) * 1.21).toFixed(2)
        }
      } : null
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
