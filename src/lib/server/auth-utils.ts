import { error } from '@sveltejs/kit';

export async function validateUser(locals: App.Locals) {
  const user = locals.user;
  if (!user) {
    throw error(401, 'No autorizado');
  }
  return { user };
}
