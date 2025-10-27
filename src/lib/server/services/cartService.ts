import prisma from '$lib/server/prisma';
import { StockService } from './stockService';
import { Decimal } from '@prisma/client/runtime/library';

export interface CartItemData {
  productId: string;
  quantity: number;
}

export interface CartWithItems {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: Decimal;
      stock: number;
      sku?: string | null;
      category?: string | null;
      imageUrl?: string | null;
      isActive: boolean;
    };
  }>;
  stockReservations: Array<{
    id: string;
    productId: string;
    quantity: number;
    expiresAt: Date;
    product: {
      id: string;
      name: string;
      price: Decimal;
      stock: number;
      category?: string | null;
      imageUrl?: string | null;
      isActive: boolean;
    };
  }>;
}

export class CartService {
  /**
   * Obtiene o crea un carrito para un usuario
   */
  static async getOrCreateCart(userId: string): Promise<string> {
    let cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    return cart.id;
  }

  /**
   * Agrega un producto al carrito con reserva de stock
   */
  static async addToCart(userId: string, productId: string, quantity: number): Promise<{
    success: boolean;
    message: string;
    cart?: CartWithItems | null;
  }> {
    // Obtener o crear carrito
    const cartId = await this.getOrCreateCart(userId);

    // Verificar stock disponible
    const available = await StockService.checkStockAvailability(productId, quantity);
    if (!available) {
      return {
        success: false,
        message: 'Stock insuficiente para la cantidad solicitada'
      };
    }

    // Usar transacción para asegurar consistencia
    await prisma.$transaction(async (tx) => {
      // Verificar si el producto ya está en el carrito
      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId,
          productId
        }
      });

      if (existingItem) {
        // Actualizar cantidad y extender reserva
        const newQuantity = existingItem.quantity + quantity;

        // Verificar stock para la nueva cantidad total
        const totalAvailable = await StockService.checkStockAvailability(productId, newQuantity);
        if (!totalAvailable) {
          throw new Error('Stock insuficiente para la cantidad total');
        }

        // Actualizar item del carrito
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity }
        });

        // Liberar reserva anterior y crear nueva
        await StockService.releaseProductReservation(cartId, productId);
        await StockService.reserveStock(cartId, productId, newQuantity);
      } else {
        // Agregar nuevo item al carrito
        await tx.cartItem.create({
          data: {
            cartId,
            productId,
            quantity
          }
        });

        // Crear reserva de stock
        await StockService.reserveStock(cartId, productId, quantity);
      }
    });

    // Obtener carrito actualizado
    const cart = await this.getCartWithDetails(cartId);

    return {
      success: true,
      message: 'Producto agregado al carrito',
      cart
    };
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  static async updateCartItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<{
    success: boolean;
    message: string;
    cart?: CartWithItems | null;
  }> {
    const cartId = await this.getOrCreateCart(userId);

    if (quantity <= 0) {
      return await this.removeFromCart(userId, productId);
    }

    // Verificar stock disponible
    const available = await StockService.checkStockAvailability(productId, quantity);
    if (!available) {
      return {
        success: false,
        message: 'Stock insuficiente para la cantidad solicitada'
      };
    }

    // Usar transacción
    await prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.findFirst({
        where: {
          cartId,
          productId
        }
      });

      if (!item) {
        throw new Error('Producto no encontrado en el carrito');
      }

      // Actualizar cantidad
      await tx.cartItem.update({
        where: { id: item.id },
        data: { quantity }
      });

      // Actualizar reserva de stock
      await StockService.releaseProductReservation(cartId, productId);
      await StockService.reserveStock(cartId, productId, quantity);
    });

    const cart = await this.getCartWithDetails(cartId);

    return {
      success: true,
      message: 'Cantidad actualizada',
      cart
    };
  }

  /**
   * Remueve un producto del carrito y libera su reserva
   */
  static async removeFromCart(userId: string, productId: string): Promise<{
    success: boolean;
    message: string;
    cart?: CartWithItems | null;
  }> {
    const cartId = await this.getOrCreateCart(userId);

    // Usar transacción
    await prisma.$transaction(async (tx) => {
      // Remover item del carrito
      await tx.cartItem.deleteMany({
        where: {
          cartId,
          productId
        }
      });

      // Liberar reserva
      await StockService.releaseProductReservation(cartId, productId);
    });

    const cart = await this.getCartWithDetails(cartId);

    return {
      success: true,
      message: 'Producto removido del carrito',
      cart
    };
  }

  /**
   * Limpia todo el carrito y libera todas las reservas
   */
  static async clearCart(userId: string): Promise<{
    success: boolean;
    message: string;
    cart?: CartWithItems | null;
  }> {
    const cartId = await this.getOrCreateCart(userId);

    // Usar transacción
    await prisma.$transaction(async (tx) => {
      // Remover todos los items
      await tx.cartItem.deleteMany({
        where: { cartId }
      });

      // Liberar todas las reservas
      await StockService.releaseCartReservations(cartId);
    });

    const cart = await this.getCartWithDetails(cartId);

    return {
      success: true,
      message: 'Carrito vaciado',
      cart
    };
  }

  /**
   * Obtiene el carrito con todos los detalles incluyendo reservas
   */
  static async getCartWithDetails(cartId: string): Promise<CartWithItems | null> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  stock: true,
                  sku: true,
                  category: true,
                  imageUrl: true,
                  isActive: true
                }
              }
            }
          },
          stockReservations: {
            where: {
              expiresAt: {
                gt: new Date()
              }
            },
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  stock: true,
                  category: true,
                  imageUrl: true,
                  isActive: true
                }
              }
            }
          }
        }
      });

      if (!cart) return null;

      return {
        id: cart.id,
        userId: cart.userId,
        items: cart.items,
        stockReservations: cart.stockReservations
      };
    } catch (error) {
      console.error('Error getting cart with details:', error);
      return null;
    }
  }

  /**
   * Extiende el tiempo de todas las reservas de un carrito
   */
  static async extendCartReservations(cartId: string): Promise<boolean> {
    const reservations = await prisma.stockReservation.findMany({
      where: {
        cartId,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    let allExtended = true;

    for (const reservation of reservations) {
      const extended = await StockService.extendReservation(cartId, reservation.productId);
      if (!extended) allExtended = false;
    }

    return allExtended;
  }

  /**
   * Valida si el carrito puede proceder al checkout
   */
  static async validateCartForCheckout(cartId: string): Promise<{
    valid: boolean;
    items: Array<{
      productId: string;
      productName: string;
      requested: number;
      available: number;
      reserved: number;
    }>;
  }> {
    return await StockService.validateCartForCheckout(cartId);
  }

  /**
   * Procesa el checkout y convierte reservas en stock permanente
   */
  static async processCheckout(cartId: string): Promise<{
    success: boolean;
    message: string;
    orderId?: string;
  }> {
    // Validar carrito para checkout
    const validation = await this.validateCartForCheckout(cartId);

    if (!validation.valid) {
      return {
        success: false,
        message: 'Algunos productos no tienen stock disponible'
      };
    }

    // TODO: Implementar lógica de checkout completa
    // Por ahora solo liberamos las reservas como si el checkout fuera exitoso

    await StockService.releaseCartReservations(cartId);

    return {
      success: true,
      message: 'Checkout procesado exitosamente'
    };
  }
}
