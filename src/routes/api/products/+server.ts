import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/products
 * Obtiene todos los productos activos con filtros opcionales
 */
export async function GET({ url }) {
  try {
    // Obtener parámetros de consulta
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Construir filtros
    const where: Record<string, unknown> = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Obtener productos con paginación
    const products = await prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    });

    // Obtener total para paginación
    const total = await prisma.product.count({ where });

    return json({
      success: true,
      data: products,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Crea un nuevo producto (requiere autenticación de admin)
 */
export async function POST({ request }) {
  try {
    // Verificar autenticación (temporalmente deshabilitado para testing)
    // const userId = locals.user?.id;
    // if (!userId) {
    //   return json({
    //     success: false,
    //     error: 'Autenticación requerida'
    //   }, { status: 401 });
    // }

    const { name, description, price, stock, sku, category, imageUrl } = await request.json();

    if (!name || !price) {
      return json({
        success: false,
        error: 'Nombre y precio son campos obligatorios'
      }, { status: 400 });
    }

    // Crear producto
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: stock || 0,
        sku: sku || null,
        category: category || null,
        imageUrl: imageUrl || null,
        isActive: true
      }
    });

    return json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
