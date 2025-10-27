#!/usr/bin/env node

/**
 * Script para limpiar reservas de stock expiradas
 *
 * Este script debe ejecutarse cada 5 minutos via cron o similar:
 * \*\/5 \* \* \* \* /usr/bin/node /path/to/bookstore/cleanup-stock.js
 */

import { PrismaClient } from '@prisma/client';

// Importar función de cleanup (necesitará ajuste según la estructura final)
async function cleanupExpiredStockReservations() {
  const prisma = new PrismaClient();

  try {
    const result = await prisma.stockReservation.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return result.count;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  try {
    console.log(`[${new Date().toISOString()}] 🧹 Iniciando limpieza de reservas de stock expiradas...`);

    const deletedCount = await cleanupExpiredStockReservations();

    console.log(`[${new Date().toISOString()}] ✅ Limpieza completada: ${deletedCount} reservas eliminadas`);

    // También limpiar carritos abandonados (sin actividad por más de 24 horas)
    console.log(`[${new Date().toISOString()}] 🗑️ Buscando carritos abandonados...`);

    const prisma = new PrismaClient();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const abandonedCarts = await prisma.cart.findMany({
      where: {
        updatedAt: {
          lt: oneDayAgo
        },
        items: {
          some: {}
        }
      },
      include: {
        items: true,
        stockReservations: true
      }
    });

    if (abandonedCarts.length > 0) {
      console.log(`[${new Date().toISOString()}] 📦 Encontrados ${abandonedCarts.length} carritos abandonados`);

      for (const cart of abandonedCarts) {
        console.log(`[${new Date().toISOString()}] 🗑️ Liberando carrito ${cart.id} con ${cart.items.length} items y ${cart.stockReservations.length} reservas`);

        // Liberar todas las reservas del carrito
        await prisma.stockReservation.deleteMany({
          where: { cartId: cart.id }
        });

        // Marcar carrito como abandonado (opcional)
        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            updatedAt: new Date(),
            // Podríamos agregar un campo abandonedAt si queremos trackear esto
          }
        });
      }

      console.log(`[${new Date().toISOString()}] ✅ Carritos abandonados procesados`);
    } else {
      console.log(`[${new Date().toISOString()}] ✅ No hay carritos abandonados`);
    }

    console.log(`[${new Date().toISOString()}] 🎉 Cleanup completado exitosamente`);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error en cleanup:`, error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}
