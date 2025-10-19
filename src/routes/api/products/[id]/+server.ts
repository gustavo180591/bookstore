import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/products/[id]
 * Obtiene un producto específico por su ID
 */
export async function GET({ params }) {
  try {
    const { id } = params;

    if (!id) {
      throw error(400, 'ID de producto requerido');
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        // Puedes incluir relaciones adicionales aquí si las necesitas
        // Por ejemplo, reseñas, categorías relacionadas, etc.
      }
    });

    if (!product) {
      throw error(404, 'Producto no encontrado');
    }

    // Verificar que el producto esté activo
    if (!product.isActive) {
      throw error(404, 'Producto no disponible');
    }

    return json({
      success: true,
      data: product
    });

  } catch (err) {
    if (err.status) {
      throw err; // Re-throw SvelteKit errors
    }

    console.error('Error al obtener producto:', err);
    throw error(500, 'Error interno del servidor');
  }
}
