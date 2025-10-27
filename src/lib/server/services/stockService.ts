import prisma from '$lib/server/prisma';

export class StockService {
  private static readonly RESERVATION_TIMEOUT_MINUTES = 15;

  /**
   * Verifica si hay stock disponible para un producto considerando reservas activas
   */
  static async checkStockAvailability(productId: string, requestedQuantity: number): Promise<boolean> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) return false;

      // Contar reservas activas para este producto
      const reservations = await prisma.stockReservation.findMany({
        where: {
          productId,
          expiresAt: {
            gt: new Date()
          }
        }
      });

      const reservedQuantity = reservations.reduce((sum, res) => sum + res.quantity, 0);
      const availableStock = product.stock - reservedQuantity;

      return availableStock >= requestedQuantity;
    } catch (error) {
      console.error('Error checking stock availability:', error);
      return false;
    }
  }

  /**
   * Obtiene stock disponible para un producto considerando reservas
   */
  static async getAvailableStock(productId: string): Promise<number> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) return 0;

      // Contar reservas activas para este producto
      const reservations = await prisma.stockReservation.findMany({
        where: {
          productId,
          expiresAt: {
            gt: new Date()
          }
        }
      });

      const reservedQuantity = reservations.reduce((sum, res) => sum + res.quantity, 0);

      return Math.max(0, product.stock - reservedQuantity);
    } catch (error) {
      console.error('Error getting available stock:', error);
      return 0;
    }
  }

  /**
   * Crea una reserva de stock para un producto en el carrito
   */
  static async reserveStock(cartId: string, productId: string, quantity: number): Promise<boolean> {
    try {
      // Verificar stock disponible
      const available = await this.checkStockAvailability(productId, quantity);
      if (!available) return false;

      // Crear reserva
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.RESERVATION_TIMEOUT_MINUTES);

      await prisma.stockReservation.create({
        data: {
          cartId,
          productId,
          quantity,
          expiresAt
        }
      });

      return true;
    } catch (error) {
      console.error('Error creating stock reservation:', error);
      return false;
    }
  }

  /**
   * Libera todas las reservas de un carrito
   */
  static async releaseCartReservations(cartId: string): Promise<void> {
    try {
      await prisma.stockReservation.deleteMany({
        where: { cartId }
      });
    } catch (error) {
      console.error('Error releasing cart reservations:', error);
    }
  }

  /**
   * Libera reservas específicas de productos
   */
  static async releaseProductReservation(cartId: string, productId: string): Promise<void> {
    try {
      await prisma.stockReservation.deleteMany({
        where: {
          cartId,
          productId
        }
      });
    } catch (error) {
      console.error('Error releasing product reservation:', error);
    }
  }

  /**
   * Limpia reservas expiradas
   */
  static async cleanupExpiredReservations(): Promise<number> {
    const result = await prisma.stockReservation.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return result.count;
  }

  /**
   * Obtiene reservas activas de un carrito
   */
  static async getCartReservations(cartId: string) {
    return await prisma.stockReservation.findMany({
      where: {
        cartId,
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
            stock: true
          }
        }
      }
    });
  }

  /**
   * Extiende el tiempo de reserva de un carrito (máximo 15 minutos más)
   */
  static async extendReservation(cartId: string, productId: string): Promise<boolean> {
    const reservation = await prisma.stockReservation.findFirst({
      where: {
        cartId,
        productId,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!reservation) return false;

    // Solo extender si no han pasado más de 10 minutos
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

    if (reservation.createdAt < tenMinutesAgo) return false;

    const newExpiresAt = new Date();
    newExpiresAt.setMinutes(newExpiresAt.getMinutes() + this.RESERVATION_TIMEOUT_MINUTES);

    await prisma.stockReservation.update({
      where: { id: reservation.id },
      data: { expiresAt: newExpiresAt }
    });

    return true;
  }

  /**
   * Valida si un carrito puede proceder al checkout (stock disponible)
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
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: true
      }
    });

    const validationResults = [];

    for (const item of cartItems) {
      const availableStock = await this.getAvailableStock(item.productId);
      const reservedQuantity = await this.getReservedQuantity(item.productId, cartId);

      validationResults.push({
        productId: item.productId,
        productName: item.product.name,
        requested: item.quantity,
        available: availableStock,
        reserved: reservedQuantity
      });
    }

    const valid = validationResults.every(item =>
      item.requested <= item.available + item.reserved
    );

    return { valid, items: validationResults };
  }

  private static async getReservedQuantity(productId: string, cartId: string): Promise<number> {
    const reservation = await prisma.stockReservation.findFirst({
      where: {
        productId,
        cartId,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    return reservation?.quantity || 0;
  }
}
