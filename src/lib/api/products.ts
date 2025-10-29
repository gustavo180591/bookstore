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

export interface SingleProductResponse {
  success: boolean;
  data: Product;
}

/**
 * Obtiene un producto específico por su ID
 */
export async function fetchProduct(id: string): Promise<SingleProductResponse> {
  const url = `${API_BASE}/api/products/${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al obtener producto: ${response.statusText}`);
  }

  return response.json();
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

// Categorías predefinidas
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

/**
 * Obtiene categorías únicas de productos
 */
export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetchProducts({ limit: 1000 });
    const productCategories = response.data
      .map(product => product.category)
      .filter(Boolean) as string[];

    // Combinar categorías predefinidas con las existentes y eliminar duplicados
    const allCategories = [...new Set([...PREDEFINED_CATEGORIES, ...productCategories])];
    
    // Ordenar alfabéticamente
    return allCategories.sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return [...PREDEFINED_CATEGORIES]; // Devolver categorías predefinidas en caso de error
  }
}

/**
 * Elimina un producto por su ID
 */
export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const url = `${API_BASE}/api/products/${id}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar el producto: ${response.statusText}`);
  }

  return response.json();
}
