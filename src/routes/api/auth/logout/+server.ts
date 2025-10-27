import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario actual
 */
export async function POST({ cookies }) {
  try {
    // Obtener el session ID de las cookies
    const sessionId = cookies.get('sessionId');

    if (sessionId) {
      try {
        // Buscar y eliminar la sesión de la base de datos
        const deletedSession = await prisma.session.delete({
          where: { id: sessionId }
        });

        console.log('Sesión eliminada:', deletedSession.id);
      } catch (error) {
        // Si la sesión no existe o ya fue eliminada, no es un error
        if (error instanceof Error && error.message.includes('Record to delete not found')) {
          console.log('Sesión ya no existe en la base de datos');
        } else {
          throw error;
        }
      }
    }

    // Limpiar la cookie de sesión
    cookies.delete('sessionId', {
      path: '/',
      httpOnly: true,
      secure: false, // Cambiar a true en producción con HTTPS
      sameSite: 'lax'
    });

    return json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
