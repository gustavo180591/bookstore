import type { Handle } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend the Locals interface to include user
declare global {
  namespace App {
    interface Locals {
      user?: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: string;
      };
    }
  }
}

export const handleSession: Handle = async ({ event, resolve }) => {
  // Obtener el session ID de las cookies
  const sessionId = event.cookies.get('sessionId');

  if (sessionId) {
    try {
      // Buscar la sesión en la base de datos
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true }
      });

      // Verificar si la sesión es válida y no ha expirado
      if (session && session.expiresAt > new Date()) {
        // Renovar la sesión por 24 horas más
        const newExpiresAt = new Date();
        newExpiresAt.setHours(newExpiresAt.getHours() + 24);

        await prisma.session.update({
          where: { id: sessionId },
          data: { expiresAt: newExpiresAt }
        });

        // Agregar el usuario a locals
        event.locals.user = {
          id: session.user.id,
          email: session.user.email,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          role: session.user.role
        };
      } else if (session) {
        // Sesión expirada, eliminarla
        await prisma.session.delete({
          where: { id: sessionId }
        });
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
    }
  }

  const response = await resolve(event);

  // Configurar headers de seguridad para las cookies de sesión
  if (event.locals.user) {
    response.headers.set('cache-control', 'no-cache, no-store, must-revalidate');
  }

  return response;
};
