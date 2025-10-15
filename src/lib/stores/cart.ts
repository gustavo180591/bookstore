import { writable, derived } from 'svelte/store';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    stock: number;
    category?: string;
    imageUrl?: string;
    isActive: boolean;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  totals: {
    subtotal: string;
    tax: string;
    total: string;
  };
}

export interface CartTotals {
  subtotal: string;
  tax: string;
  total: string;
}

// Estado inicial del carrito
const initialCart: Cart = {
  id: '',
  items: [],
  totals: {
    subtotal: '0.00',
    tax: '0.00',
    total: '0.00'
  }
};

// Store principal del carrito
export const cart = writable<Cart>(initialCart);

// Store derivado para obtener el número total de items
export const cartItemCount = derived(cart, ($cart) => {
  return $cart.items.reduce((total, item) => total + item.quantity, 0);
});

// Store derivado para verificar si el carrito está vacío
export const isCartEmpty = derived(cart, ($cart) => {
  return $cart.items.length === 0;
});

// Funciones para gestionar el carrito
export const cartActions = {
  // Cargar carrito desde la API (requiere autenticación)
  async loadCart() {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();

      if (response.status === 401) {
        // Usuario no autenticado
        cart.set(initialCart);
        return { success: false, needsAuth: true };
      }

      if (data.success) {
        cart.set(data.data);
        return { success: true };
      } else {
        console.error('Error cargando carrito:', data.error);
        cart.set(initialCart);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
      cart.set(initialCart);
      return { success: false, error: 'Error interno del servidor' };
    }
  },

  // Agregar producto al carrito (requiere autenticación)
  async addToCart(productId: string, quantity: number = 1) {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();

      if (response.status === 401) {
        return { success: false, needsAuth: true, error: 'Debes iniciar sesión para agregar productos al carrito' };
      }

      if (data.success) {
        // Recargar el carrito completo
        await this.loadCart();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  },

  // Actualizar cantidad de un item (requiere autenticación)
  async updateQuantity(itemId: string, quantity: number) {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();

      if (response.status === 401) {
        return { success: false, needsAuth: true, error: 'Debes iniciar sesión para modificar el carrito' };
      }

      if (data.success) {
        await this.loadCart();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  },

  // Remover item del carrito (requiere autenticación)
  async removeFromCart(itemId: string) {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.status === 401) {
        return { success: false, needsAuth: true, error: 'Debes iniciar sesión para modificar el carrito' };
      }

      if (data.success) {
        await this.loadCart();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error removiendo del carrito:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  },

  // Vaciar carrito completo (requiere autenticación)
  async clearCart() {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.status === 401) {
        return { success: false, needsAuth: true, error: 'Debes iniciar sesión para vaciar el carrito' };
      }

      if (data.success) {
        cart.set(initialCart);
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error vaciando carrito:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  },

  // Formatear precio para mostrar
  formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(numPrice);
  }
};
