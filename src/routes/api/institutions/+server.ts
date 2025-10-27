import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { validateUser } from '$lib/server/auth-utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Check if user is authenticated
    await validateUser(locals);

    // Get all active institutions
    const institutions = await prisma.institution.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        city: true,
        province: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return json(
      { error: 'Error al cargar las instituciones' },
      { status: 500 }
    );
  }
};
