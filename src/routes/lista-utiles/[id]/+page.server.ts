import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  // Check if user is authenticated
  const session = await locals.validateUser();
  if (!session?.user) {
    throw error(401, 'No autorizado');
  }

  try {
    // Get the school list with its items and related data
    const list = await prisma.schoolList.findUnique({
      where: {
        id: params.id,
        createdById: session.user.userId, // Ensure the user owns this list
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
        items: {
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!list) {
      throw error(404, 'Lista no encontrada');
    }

    // Transform items to include originalName for substituted items
    const transformedItems = list.items.map((item) => {
      if (item.status === 'SUBSTITUTED' && item.product) {
        return {
          ...item,
          originalName: item.name,
          name: item.product.name,
        };
      }
      return item;
    });

    return {
      list: {
        ...list,
        items: transformedItems,
      },
    };
  } catch (err) {
    console.error('Error loading school list:', err);
    throw error(500, 'Error al cargar la lista de útiles');
  }
};
