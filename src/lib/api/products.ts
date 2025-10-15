import { dev } from '$app/environment';

const API_BASE = dev ? 'http://localhost:5173' : '';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  sku?: string;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ProductsFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

/**
 * Obtiene productos desde la API con filtros opcionales
 */
export async function fetchProducts(filters: ProductsFilters = {}): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();

  if (filters.category) searchParams.set('category', filters.category);
  if (filters.search) searchParams.set('search', filters.search);
  if (filters.limit) searchParams.set('limit', filters.limit.toString());
  if (filters.offset) searchParams.set('offset', filters.offset.toString());

  const url = `${API_BASE}/api/products?${searchParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Obtiene categorías únicas de productos
 */
export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetchProducts({ limit: 1000 });
    const categories = response.data
      .map(product => product.category)
      .filter(Boolean) as string[];

    return [...new Set(categories)].sort();
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return [];
  }
}
