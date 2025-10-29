import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadFile } from '$lib/server/services/fileService';
import type { ProductData, ProductFormData } from '$lib/types/product';

// GET /api/admin/products - List all products with pagination
// Query params: page, limit, search, category, active
export const GET: RequestHandler = async ({ url }) => {
  try {
    // Pagination
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Filters
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const active = url.searchParams.get('active');
    
    // Build where clause
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
        sku?: { contains: string; mode: 'insensitive' };
      }>;
      category?: string;
      isActive?: boolean;
    } = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (active !== null) {
      where.isActive = active === 'true';
    }
    
    // Get total count for pagination
    const total = await prisma.product.count({ where });
    
    // Get paginated products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        sku: true,
        category: true,
        imageUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return json({
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (err) {
    console.error('Error fetching products:', err);
    throw error(500, 'Error al obtener los productos');
  }
};

// POST /api/admin/products - Create a new product
export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData() as ProductFormData;
    const data = Object.fromEntries(formData.entries());
    
    const productData: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'> = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price as string),
      stock: parseInt(data.stock as string),
      category: data.category,
      sku: data.sku || null,
      isActive: data.isActive !== undefined ? data.isActive === 'true' : true,
    };

    // Handle file upload if present
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadFile(imageFile);
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Error al subir la imagen');
      }
      productData.imageUrl = uploadResult.path;
    }

    const newProduct = await prisma.product.create({
      data: productData
    });

    return json(newProduct, { status: 201 });
  } catch (err: any) {
    console.error('Error creating product:', err);
    throw error(500, err.message || 'Error al crear el producto');
  }
};
