import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Predefined categories
const PREDEFINED_CATEGORIES = [
  'Ofertas',
  'Papelería',
  'Artículos de Oficina',
  'Escritura',
  'Medición',
  'Cuadernos',
  'Carpetas',
  'Arte',
  'Adhesivos',
  'Corte',
  'Agendas',
  'Pizarras',
  'Sets para Regalar',
  'Complementos Escolares'
];

// GET /api/admin/categories - List all categories
export const GET: RequestHandler = async () => {
  try {
    // Get all unique categories from products with counts
    const dbCategories = await prisma.$queryRaw<Array<{name: string, productCount: bigint}>>`
      SELECT category as name, COUNT(*) as "productCount"
      FROM "Product"
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY category ASC
    `;
    
    // Convert BigInt to number for JSON serialization
    const formattedDbCategories = dbCategories.map(category => ({
      name: category.name,
      productCount: Number(category.productCount)
    }));
    
    // Create a map of existing categories for quick lookup
    const categoryMap = new Map(
      formattedDbCategories.map(cat => [cat.name, cat.productCount])
    );
    
    // Add predefined categories with count 0 if they don't exist
    const allCategories = [...PREDEFINED_CATEGORIES, ...formattedDbCategories.map(c => c.name)]
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
      .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
      .map(name => ({
        name,
        productCount: categoryMap.get(name) || 0
      }));
    
    return json({ data: allCategories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    throw error(500, 'Error al obtener las categorías');
  }
};

// POST /api/admin/categories - Create a new category
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string') {
      throw error(400, 'El nombre de la categoría es requerido');
    }
    
    // Since we're not using a separate categories table,
    // we'll just return the category name
    // In a real app, you might want to create a proper categories table
    
    return json({
      success: true,
      data: { name, productCount: 0 }
    }, { status: 201 });
    
  } catch (err) {
    console.error('Error creating category:', err);
    
    if (err.status === 400) {
      throw err;
    }
    
    throw error(500, 'Error al crear la categoría');
  }
};
