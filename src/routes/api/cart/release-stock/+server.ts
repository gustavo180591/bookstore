import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export async function POST({ request, locals }) {
  try {
    const { productId, quantity } = await request.json();
    
    // Verificar autenticación
    if (!locals.user) {
      return json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar si hay reservas activas para este usuario y producto
    const activeReservations = await prisma.stockReservation.findMany({
      where: {
        productId,
        userId: locals.user.id,
        expiresAt: { gt: new Date() } // Solo reservas no expiradas
      },
      orderBy: { expiresAt: 'asc' }
    });

    if (activeReservations.length === 0) {
      return json({ error: 'No hay reservas activas' }, { status: 400 });
    }

    // Calcular la cantidad total a liberar
    let remaining = quantity;
    const reservationsToDelete: string[] = [];

    for (const reservation of activeReservations) {
      if (remaining <= 0) break;
      
      const releaseAmount = Math.min(remaining, reservation.quantity);
      
      // Actualizar la reserva o eliminarla
      if (releaseAmount === reservation.quantity) {
        reservationsToDelete.push(reservation.id);
      } else {
        await prisma.stockReservation.update({
          where: { id: reservation.id },
          data: { quantity: { decrement: releaseAmount } }
        });
      }
      
      // Devolver el stock al producto
      await prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: releaseAmount } }
      });
      
      remaining -= releaseAmount;
    }

    // Eliminar reservas completadas
    if (reservationsToDelete.length > 0) {
      await prisma.stockReservation.deleteMany({
        where: { id: { in: reservationsToDelete } }
      });
    }

    return json({ 
      success: true, 
      released: quantity - remaining,
      remaining: remaining > 0 ? remaining : 0
    });

  } catch (error) {
    console.error('Error liberando stock:', error);
    return json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
