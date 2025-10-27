import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// 15 minutes in milliseconds
const RESERVATION_DURATION = 15 * 60 * 1000;

interface Reservation {
  productId: string;
  quantity: number;
  expiresAt: number;
}

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
export const cart = writable<Cart>(
  browser ? JSON.parse(localStorage.getItem('cart') || JSON.stringify(initialCart)) : initialCart
);

// Persist cart to localStorage
if (browser) {
  cart.subscribe(($cart) => {
    localStorage.setItem('cart', JSON.stringify($cart));
  });
}

// Store para las reservas de stock
export const stockReservations = writable<Record<string, Reservation>>(
  browser ? JSON.parse(localStorage.getItem('stockReservations') || '{}') : {}
);

// Persist stock reservations
if (browser) {
  stockReservations.subscribe(($reservations) => {
    localStorage.setItem('stockReservations', JSON.stringify($reservations));
  });
}

// Limpiar reservas expiradas
const cleanupExpiredReservations = () => {
  stockReservations.update(($reservations) => {
    const now = Date.now();
    const validReservations: Record<string, Reservation> = {};
    
    for (const [key, res] of Object.entries($reservations)) {
      if (res.expiresAt > now) {
        validReservations[key] = res;
      } else {
        // Liberar stock cuando expira la reserva
        console.log(`Reserva expirada para producto ${res.productId}`);
      }
    }
    
    return validReservations;
  });
};

// Verificar reservas al cargar
if (browser) {
  cleanupExpiredReservations();
  // Verificar cada minuto
  setInterval(cleanupExpiredReservations, 60000);
}

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
        // Usuario no autenticado - no intentar recargar
        console.log('Usuario no autenticado, usando carrito local');
        return { success: false, needsAuth: true };
      }

      if (data.success) {
        cart.set(data.data);
        return { success: true };
      } else {
        console.error('Error cargando carrito:', data.error);
        // Mantener carrito local en caso de error
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
      // No resetear el carrito si hay error de conexión
      return { success: false, error: 'Error de conexión' };
    }
  },

  // Reservar stock temporalmente
  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const response = await fetch('/api/cart/reserve-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al reservar stock');
      }

      // Guardar la reserva localmente
      const reservation: Reservation = {
        productId,
        quantity,
        expiresAt: Date.now() + RESERVATION_DURATION
      };

      stockReservations.update(($reservations) => ({
        ...$reservations,
        [`${productId}-${Date.now()}`]: reservation
      }));

      return true;
    } catch (error) {
      console.error('Error reservando stock:', error);
      throw error;
    }
  },

  // Liberar stock reservado
  async releaseStock(productId: string, quantity: number): Promise<void> {
    try {
      const response = await fetch('/api/cart/release-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error liberando stock:', error);
      }
    } catch (error) {
      console.error('Error liberando stock:', error);
    }
  },

  // Agregar producto al carrito (requiere autenticación)
  async addToCart(productId: string, quantity: number = 1) {
    try {
      const response = await fetch('/api/cart', {
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
