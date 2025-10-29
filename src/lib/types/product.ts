export interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku: string | null;
  isActive: boolean;
  imageUrl?: string | null;
  imageFile?: File | null;
}

export interface Product extends Omit<ProductData, 'imageFile'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData extends FormData {
  get(name: string): string | File;
  get(name: 'imageFile'): File | null;
  get(name: string): string | File | null;
}
