import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

// Load the school list for editing
export const load: PageServerLoad = async ({ params, locals }) => {
  // Check if user is authenticated
  const session = await locals.validateUser();
  if (!session?.user) {
    throw error(401, 'No autorizado');
  }

  try {
    // Get the school list with its items
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
        },
      },
    });

    if (!list) {
      throw error(404, 'Lista no encontrada');
    }

    return {
      list: {
        ...list,
        items: list.items.map(item => ({
          ...item,
          // Ensure notes is a string, not null
          notes: item.notes || '',
        })),
      },
    };
  } catch (err) {
    console.error('Error loading school list for editing:', err);
    throw error(500, 'Error al cargar la lista para edición');
  }
};

// Handle form submission for updating a school list
export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    // Check if user is authenticated
    const session = await locals.validateUser();
    if (!session?.user) {
      throw error(401, 'No autorizado');
    }

    // Get form data
    const formData = await request.formData();
    const { name, grade, institutionId, notes, items } = Object.fromEntries(formData);
    
    // Parse items if it's a string (from form data)
    let parsedItems = [];
    try {
      parsedItems = typeof items === 'string' ? JSON.parse(items) : [];
    } catch (e) {
      console.error('Error parsing items:', e);
      return fail(400, { error: 'Formato de artículos inválido' });
    }

    // Validate required fields
    if (!name || !grade || !institutionId) {
      return fail(400, { error: 'Nombre, grado e institución son campos obligatorios' });
    }

    // Validate items
    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      return fail(400, { error: 'La lista debe contener al menos un artículo' });
    }

    try {
      // Update the school list and its items in a transaction
      await prisma.$transaction(async (prisma) => {
        // 1. Update the school list
        await prisma.schoolList.update({
          where: {
            id: params.id,
            createdById: session.user.userId, // Ensure the user owns this list
          },
          data: {
            name: String(name),
            grade: String(grade),
            institutionId: String(institutionId),
            notes: notes ? String(notes) : null,
            updatedAt: new Date(),
          },
        });

        // 2. Get existing item IDs to determine which ones to delete
        const existingItems = await prisma.schoolListItem.findMany({
          where: { schoolListId: params.id },
          select: { id: true },
        });
        
        const existingItemIds = existingItems.map(item => item.id);
        const updatedItemIds = parsedItems
          .map(item => item.id)
          .filter((id): id is string => typeof id === 'string' && !id.startsWith('new-'));
        
        // 3. Delete items that were removed
        const itemsToDelete = existingItemIds.filter(id => !updatedItemIds.includes(id));
        if (itemsToDelete.length > 0) {
          await prisma.schoolListItem.deleteMany({
            where: {
              id: { in: itemsToDelete },
              schoolListId: params.id,
            },
          });
        }

        // 4. Update or create items
        for (const [index, item] of parsedItems.entries()) {
          const itemData = {
            name: String(item.name),
            quantity: Number(item.quantity) || 1,
            notes: item.notes ? String(item.notes) : null,
            sortOrder: index,
            status: item.status || 'PENDING',
          };

          if (item.id && !item.id.startsWith('new-')) {
            // Update existing item
            await prisma.schoolListItem.update({
              where: { id: item.id },
              data: itemData,
            });
          } else {
            // Create new item
            await prisma.schoolListItem.create({
              data: {
                ...itemData,
                schoolListId: params.id!,
              },
            });
          }
        }
      });

      // Redirect to the view page after successful update
      throw redirect(303, `/lista-utiles/${params.id}`);
    } catch (err) {
      console.error('Error updating school list:', err);
      return fail(500, { error: 'Error al actualizar la lista de útiles' });
    }
  },
};
