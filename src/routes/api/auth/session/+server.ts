import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  // Verificar si hay un usuario autenticado en locals
  const user = locals.user;

  if (user) {
    // Remover información sensible antes de devolver
    const userWithoutPassword = { ...user };

    return json({
      user: userWithoutPassword,
      isLoggedIn: true
    });
  }

  // Usuario no autenticado
  return json({
    user: null,
    isLoggedIn: false
  });
};
