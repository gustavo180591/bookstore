import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CartService } from '$lib/server/services/cartService';

/**
 * GET /api/cart
 * Obtiene el carrito actual del usuario con reservas de stock (requiere autenticación)
 */
export const GET: RequestHandler = async ({ locals }) => {
  try {
    const userId = locals.user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para acceder al carrito'
      }, { status: 401 });
    }

    const cartId = await CartService.getOrCreateCart(userId);
    const cart = await CartService.getCartWithDetails(cartId);

    if (!cart) {
      return json({
        success: true,
        data: {
          id: cartId,
          items: [],
          stockReservations: [],
          totals: { subtotal: '0.00', tax: '0.00', total: '0.00' }
        }
      });
    }

    // Calcular totales considerando reservas activas
    const itemsWithReservations = cart.items.map(item => {
      const reservation = cart.stockReservations.find(r => r.productId === item.productId);
      return {
        ...item,
        reserved: reservation?.quantity || 0,
        expiresAt: reservation?.expiresAt || null
      };
    });

    const subtotal = itemsWithReservations.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    const tax = subtotal * 0.21; // IVA 21%
    const total = subtotal + tax;

    return json({
      success: true,
      data: {
        id: cart.id,
        items: itemsWithReservations.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          reserved: item.reserved,
          expiresAt: item.expiresAt,
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
        stockReservations: cart.stockReservations.map(reservation => ({
          id: reservation.id,
          productId: reservation.productId,
          quantity: reservation.quantity,
          expiresAt: reservation.expiresAt,
          product: {
            id: reservation.product.id,
            name: reservation.product.name,
            price: reservation.product.price,
            stock: reservation.product.stock
          }
        })),
        totals: {
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2)
        }
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
 * POST /api/cart
 * Agrega un producto al carrito con reserva de stock (requiere autenticación)
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

    if (!productId || quantity < 1) {
      return json({
        success: false,
        error: 'Producto ID y cantidad válidos son requeridos'
      }, { status: 400 });
    }

    const result = await CartService.addToCart(userId, productId, quantity);

    if (!result.success) {
      return json({
        success: false,
        error: result.message
      }, { status: 400 });
    }

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
            imageUrl: item.product.imageUrl
          }
        })),
        stockReservations: result.cart.stockReservations,
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
 * Vacía completamente el carrito y libera reservas (requiere autenticación)
 */
export const DELETE: RequestHandler = async ({ locals }) => {
  try {
    const userId = locals.user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para vaciar el carrito'
      }, { status: 401 });
    }

    const result = await CartService.clearCart(userId);

    return json({
      success: true,
      message: result.message,
      data: result.cart ? {
        id: result.cart.id,
        items: [],
        stockReservations: []
      } : null
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
