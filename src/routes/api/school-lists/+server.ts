import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { validateUser } from '$lib/server/auth-utils';
import type { RequestHandler } from './$types';

// Types for the request body
interface SchoolListItemInput {
  name: string;
  quantity?: number;
  notes?: string;
  isOptional?: boolean;
  productId?: string;
}


interface CreateSchoolListRequest {
  name: string;
  grade: string;
  institutionId: string;
  notes?: string;
  items: SchoolListItemInput[];
}

// Create a new school list
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Check if user is authenticated
    const { user } = await validateUser(locals);

    const data: CreateSchoolListRequest = await request.json();
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

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) {
      return json(
        { error: 'La institución seleccionada no existe' },
        { status: 400 }
      );
    }

    // Create school list with items in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the school list
      const schoolList = await prisma.schoolList.create({
        data: {
          name,
          grade,
          institution: {
            connect: { id: institutionId }
          },
          description: notes || null,
          createdBy: {
            connect: { id: user.id }
          },
          status: 'DRAFT',
          items: {
            create: items.map((item, index) => {
              // Create the item data with product connection if available
              return {
                name: item.name,
                quantity: item.quantity || 1,
                notes: item.notes || null,
                sortOrder: index,
                isOptional: item.isOptional || false,
                status: 'PENDING' as const,
                // Use null instead of undefined for the product relation
                product: item.productId ? {
                  connect: { id: item.productId }
                } : null
              };
            }),
          },
        },
        include: {
          items: true,
          institution: true,
        },
      });

      return schoolList;
    });

    return json({
      id: result.id,
      message: 'Lista creada exitosamente',
    });
  } catch (error) {
    console.error('Error creating school list:', error);
    return json(
      { error: 'Error al crear la lista de útiles' },
      { status: 500 }
    );
  }
};

// Get all school lists for the current user
export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Check if user is authenticated
    const { user } = await validateUser(locals);

    // Get all lists created by the user
    const lists = await prisma.schoolList.findMany({
      where: {
        createdById: user.id  // Use the direct field name from Prisma schema
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return json(lists);
  } catch (error) {
    console.error('Error fetching school lists:', error);
    return json(
      { error: 'Error al cargar las listas de útiles' },
      { status: 500 }
    );
  }
};
