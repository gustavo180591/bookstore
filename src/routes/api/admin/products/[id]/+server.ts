import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadFile, deleteFile } from '$lib/server/services/fileService';

// Helper function to handle product data
async function handleProductData(data: any, existingProduct?: any) {
  const productData: any = {
    name: data.name,
    description: data.description,
    price: parseFloat(data.price),
    stock: parseInt(data.stock),
    category: data.category,
    sku: data.sku,
    isActive: data.isActive !== undefined ? data.isActive : true,
  };

  // Handle image upload if a file is provided
  if (data.imageFile) {
    // Delete old image if exists and is different
    if (existingProduct?.imageUrl && existingProduct.imageUrl !== data.imageFile) {
      await deleteFile(existingProduct.imageUrl);
    }
    
    // Upload new image
    const uploadResult = await uploadFile(data.imageFile);
    if (!uploadResult.success) {
      throw new Error(uploadResult.error || 'Error al subir la imagen');
    }
    productData.imageUrl = uploadResult.path;
  }

  return productData;
}

// GET /api/admin/products/[id] - Get a single product by ID
export const GET: RequestHandler = async ({ params }) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        description: true,
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

    if (!product) {
      throw error(404, 'Producto no encontrado');
    }

    return json({ data: product });
  } catch (err: any) {
    console.error(`Error fetching product ${params.id}:`, err);
    
    if (err.status === 404) {
      throw err;
    }
    
    throw error(500, 'Error al obtener el producto');
  }
};

// PUT /api/admin/products/[id] - Update a product
export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    // Get existing product to handle image updates
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!existingProduct) {
      throw error(404, 'Producto no encontrado');
    }

    const productData = await handleProductData(data, existingProduct);
    
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: productData
    });

    return json(updatedProduct);
  } catch (err: any) {
    console.error('Error updating product:', err);
    throw error(500, err.message || 'Error al actualizar el producto');
  }
};

// DELETE /api/admin/products/[id] - Delete a product
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    // Check if product exists in any order before deleting
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: params.id }
    });

    if (orderItems.length > 0) {
      // Soft delete by marking as inactive
      const updatedProduct = await prisma.product.update({
        where: { id: params.id },
        data: { isActive: false }
      });
      return json({ 
        message: 'El producto tiene pedidos asociados y ha sido marcado como inactivo',
        product: updatedProduct
      });
    }

    // Get product to delete image
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!product) {
      throw error(404, 'Producto no encontrado');
    }

    // Delete product from database
    await prisma.product.delete({
      where: { id: params.id }
    });

    // Delete associated image if exists
    if (product.imageUrl) {
      await deleteFile(product.imageUrl).catch(err => 
        console.error('Error deleting product image:', err)
      );
    }

    return json({ message: 'Producto eliminado correctamente' });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    throw error(500, err.message || 'Error al eliminar el producto');
  }
};
