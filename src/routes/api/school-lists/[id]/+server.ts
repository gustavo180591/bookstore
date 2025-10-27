import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// Update a school list
export const PUT: RequestHandler = async ({ request, params, locals }) => {
  // Check if user is authenticated
  const session = await locals.validateUser();
  if (!session?.user) {
    return json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, grade, institutionId, notes, items } = data;

    // Validate required fields
    if (!name || !grade || !institutionId) {
      return json(
        { error: 'Nombre, grado e institución son campos obligatorios' },
        { status: 400 }
      );
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return json(
        { error: 'La lista debe contener al menos un artículo' },
        { status: 400 }
      );
    }

    // Check if the list exists and belongs to the user
    const existingList = await prisma.schoolList.findUnique({
      where: {
        id: params.id,
        createdById: session.user.userId,
      },
    });

    if (!existingList) {
      return json({ error: 'Lista no encontrada' }, { status: 404 });
    }

    // Update the school list and its items in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Update the school list
      const updatedList = await prisma.schoolList.update({
        where: {
          id: params.id,
        },
        data: {
          name,
          grade,
          institutionId,
          notes: notes || null,
          updatedAt: new Date(),
        },
      });

      // 2. Get existing item IDs to determine which ones to delete
      const existingItems = await prisma.schoolListItem.findMany({
        where: { schoolListId: params.id },
        select: { id: true },
      });
      
      const existingItemIds = existingItems.map(item => item.id);
      const updatedItemIds = items
        .map((item: any) => item.id)
        .filter((id: any): id is string => typeof id === 'string' && !id.startsWith('new-'));
      
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
      for (const [index, item] of items.entries()) {
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

      return updatedList;
    });

    return json({
      id: result.id,
      message: 'Lista actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error updating school list:', error);
    return json(
      { error: 'Error al actualizar la lista de útiles' },
      { status: 500 }
    );
  }
};

// Delete a school list
export const DELETE: RequestHandler = async ({ params, locals }) => {
  // Check if user is authenticated
  const session = await locals.validateUser();
  if (!session?.user) {
    return json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // Check if the list exists and belongs to the user
    const existingList = await prisma.schoolList.findUnique({
      where: {
        id: params.id,
        createdById: session.user.userId,
      },
    });

    if (!existingList) {
      return json({ error: 'Lista no encontrada' }, { status: 404 });
    }

    // Delete the list (items will be deleted due to onDelete: Cascade)
    await prisma.schoolList.delete({
      where: {
        id: params.id,
      },
    });

    return json({
      message: 'Lista eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error deleting school list:', error);
    return json(
      { error: 'Error al eliminar la lista de útiles' },
      { status: 500 }
    );
  }
};
