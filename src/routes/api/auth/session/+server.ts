import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  // En una aplicación real, verificarías la sesión del usuario
  // Por ahora, devolvemos un usuario de ejemplo o null si no hay sesión
  return json({
    user: null, // Cambiar a un objeto de usuario válido cuando se implemente la autenticación
    isLoggedIn: false
  });
};
