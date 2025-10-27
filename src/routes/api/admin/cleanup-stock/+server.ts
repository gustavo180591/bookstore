import { cleanupExpiredStockReservations } from '$lib/server/jobs/stockCleanup';

/**
 * GET /api/admin/cleanup-stock
 * Limpia reservas de stock expiradas (solo para admins)
 */
export async function GET({ locals }) {
  try {
    // Verificar que sea admin
    const userId = locals.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Autenticación requerida'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Verificar rol de admin
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // if (user?.role !== 'ADMIN') {
    //   return new Response(JSON.stringify({
    //     success: false,
    //     error: 'Permisos insuficientes'
    //   }), {
    //     status: 403,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    console.log('🧹 Ejecutando limpieza manual de reservas de stock...');

    const deletedCount = await cleanupExpiredStockReservations();

    return new Response(JSON.stringify({
      success: true,
      message: `Limpieza completada. ${deletedCount} reservas eliminadas.`,
      data: { deletedCount }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en cleanup manual:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
