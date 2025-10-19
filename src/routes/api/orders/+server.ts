import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

/**
 * POST /api/orders
 * Crea un nuevo pedido desde el carrito del usuario
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const userId = locals.user?.id;

    if (!userId) {
      return json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para realizar un pedido'
      }, { status: 401 });
    }

    const {
      shippingAddressId,
      shippingCarrier,
      shippingCost,
      paymentMethod,
      notes
    } = await request.json();

    if (!shippingAddressId || !shippingCarrier) {
      return json({
        success: false,
        error: 'Datos de envío requeridos',
        message: 'Debes seleccionar una dirección de envío y método de entrega'
      }, { status: 400 });
    }

    // Obtener carrito del usuario
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return json({
        success: false,
        error: 'Carrito vacío',
        message: 'Tu carrito está vacío'
      }, { status: 400 });
    }

    // Verificar stock de todos los productos
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return json({
          success: false,
          error: `Stock insuficiente para ${item.product.name}`,
          message: `Solo quedan ${item.product.stock} unidades de ${item.product.name}`
        }, { status: 400 });
      }
    }

    // Calcular totales
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    const tax = subtotal * 0.21; // IVA 21%
    const total = subtotal + tax + (shippingCost || 0);

    // Crear el pedido
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'CREADO',
        total,
        currency: 'ARS',
        shippingAddressId,
        shippingCarrier,
        shippingCost: shippingCost || 0,
        notes
      },
      include: {
        shippingAddress: true,
        user: true
      }
    });

    // Crear los items del pedido y actualizar stock
    for (const cartItem of cart.items) {
      // Crear item del pedido
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: cartItem.product.price
        }
      });

      // Reducir stock del producto
      await prisma.product.update({
        where: { id: cartItem.productId },
        data: {
          stock: {
            decrement: cartItem.quantity
          }
        }
      });
    }

    // Crear pago inicial
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        userId,
        amount: total,
        currency: 'ARS',
        status: paymentMethod === 'TRANSFERENCIA' ? 'PENDING' : 'PENDING',
        provider: paymentMethod === 'MERCADO_PAGO' ? 'MERCADO_PAGO' : 'TRANSFERENCIA'
      }
    });

    // Limpiar carrito
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    await prisma.cart.delete({
      where: { id: cart.id }
    });

    return json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: {
        orderId: order.id,
        total,
        paymentId: payment.id,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Error creando pedido:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
};
