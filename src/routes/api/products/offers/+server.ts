import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET /api/products/offers - Get all products with discounts
export const GET: RequestHandler = async () => {
  try {
    // Get products with a discount (price < originalPrice)
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        price: {
          lt: prisma.product.fields.originalPrice
        },
        stock: {
          gt: 0
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        originalPrice: true,
        imageUrl: true,
        category: true,
        stock: true,
        sku: true
      },
      orderBy: {
        // Sort by discount percentage (highest first)
        price: 'asc'
      },
      take: 20 // Limit to 20 offers
    });

    return json({
      success: true,
      data: products
    });
    
  } catch (error) {
    console.error('Error fetching offers:', error);
    return json(
      { 
        success: false, 
        error: 'Error al cargar las ofertas',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
};
