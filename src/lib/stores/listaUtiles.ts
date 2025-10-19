import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  inStock: boolean;
}

export interface ListaUtilesItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  matchedProduct?: Product;
  alternatives?: Product[];
}

export interface ListaUtilesState {
  status: 'idle' | 'uploading' | 'processing' | 'processed' | 'error';
  items: ListaUtilesItem[];
  originalFile?: File;
  processedAt?: Date;
  total: number;
  error?: string;
}

// Initial state
const initialState: ListaUtilesState = {
  status: 'idle',
  items: [],
  total: 0,
};

// Create store
const createListaUtilesStore = () => {
  const { subscribe, set, update } = writable<ListaUtilesState>(
    browser ? JSON.parse(localStorage.getItem('listaUtiles') || 'null') || initialState : initialState
  );

  // Persist to localStorage
  if (browser) {
    subscribe(value => {
      localStorage.setItem('listaUtiles', JSON.stringify(value));
    });
  }

  return {
    subscribe,
    updateItem: (itemId: string, updates: Partial<ListaUtilesItem>) => {
      update(state => ({
        ...state,
        items: state.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        ),
      }));
    },
    processLista: async (file: File) => {
      try {
        update(state => ({
          ...state,
          status: 'uploading',
          originalFile: file,
          error: undefined,
        }));

        // Simulate API call to process the file
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data - In a real app, this would come from your API
        const mockItems: ListaUtilesItem[] = [
          {
            id: '1',
            name: 'Cuaderno Universitario',
            quantity: 2,
            unit: 'unid',
            matchedProduct: {
              id: 'prod_123',
              name: 'Cuaderno Universitario Tapa Dura 80 Hojas',
              price: 12.99,
              image: '/images/products/cuaderno-universitario.jpg',
              brand: 'Rivadavia',
              inStock: true,
            },
            alternatives: [
              {
                id: 'prod_124',
                name: 'Cuaderno Universitario Tapa Blanda 80 Hojas',
                price: 9.99,
                image: '/images/products/cuaderno-blando.jpg',
                brand: 'Rivadavia',
                inStock: true,
              },
            ],
          },
          // Add more mock items as needed
        ];

        const total = mockItems.reduce(
          (sum, item) => sum + (item.matchedProduct?.price || 0) * item.quantity,
          0
        );

        update(state => ({
          ...state,
          status: 'processed',
          items: mockItems,
          total,
          processedAt: new Date(),
        }));

        // Redirect to cart after processing
        goto('/carrito');
      } catch (error) {
        console.error('Error processing list:', error);
        update(state => ({
          ...state,
          status: 'error',
          error: 'No pudimos procesar tu lista. Por favor, asegúrate de que la imagen sea clara y esté bien iluminada.',
        }));
      }
    },
    clear: () => set(initialState),
  };
};

export const listaUtilesStore = createListaUtilesStore();

export const processListaUtiles = (file: File) => {
  return listaUtilesStore.processLista(file);
};
