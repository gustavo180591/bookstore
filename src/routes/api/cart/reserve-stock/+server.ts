import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export async function POST({ request, locals }) {
  try {
    const { productId, quantity } = await request.json();
    
    // Verificar autenticación
    if (!locals.user) {
      return json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar si hay suficiente stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    });

    if (!product) {
      return json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return json({ 
        error: 'Stock insuficiente', 
        available: product.stock 
      }, { status: 400 });
    }

    // Crear reserva de stock
    const reservation = await prisma.stockReservation.create({
      data: {
        productId,
        quantity,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        userId: locals.user.id
      }
    });

    // Actualizar stock disponible
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } }
    });

    return json({ 
      success: true, 
      reservationId: reservation.id,
      expiresAt: reservation.expiresAt
    });

  } catch (error) {
    console.error('Error reservando stock:', error);
    return json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
