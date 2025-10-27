#!/usr/bin/env node

/**
 * Script para crear productos básicos de prueba
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Cuaderno Universitario A4 80 hojas',
    description: 'Cuaderno de tapa dura para universitarios',
    price: 12.99,
    stock: 100,
    sku: 'CU-001',
    category: 'Papelería',
    isActive: true
  },
  {
    name: 'Lápiz HB #2',
    description: 'Lápiz de grafito estándar',
    price: 1.50,
    stock: 500,
    sku: 'LAP-001',
    category: 'Papelería',
    isActive: true
  },
  {
    name: 'Goma de borrar blanca',
    description: 'Goma de borrar para lápiz',
    price: 0.80,
    stock: 200,
    sku: 'GOM-001',
    category: 'Papelería',
    isActive: true
  },
  {
    name: 'Bolígrafo azul',
    description: 'Bolígrafo de tinta azul',
    price: 2.00,
    stock: 300,
    sku: 'BOL-001',
    category: 'Papelería',
    isActive: true
  },
  {
    name: 'Carpeta A4 con elástico',
    description: 'Carpeta de cartón con elástico',
    price: 8.50,
    stock: 150,
    sku: 'CAR-001',
    category: 'Papelería',
    isActive: true
  },
  {
    name: 'Marcadores de colores x6',
    description: 'Set de 6 marcadores de colores',
    price: 15.00,
    stock: 80,
    sku: 'MAR-001',
    category: 'Papelería',
    isActive: true
  },
  {
    name: 'Regla plástica 30cm',
    description: 'Regla transparente de 30cm',
    price: 3.00,
    stock: 120,
    sku: 'REG-001',
    category: 'Papelería',
    isActive: true
  },
  {
    name: 'Compás metálico',
    description: 'Compás de precisión metálico',
    price: 18.00,
    stock: 60,
    sku: 'COM-001',
    category: 'Geometría',
    isActive: true
  },
  {
    name: 'Transportador 180°',
    description: 'Transportador semicircular',
    price: 4.50,
    stock: 90,
    sku: 'TRA-001',
    category: 'Geometría',
    isActive: true
  },
  {
    name: 'Calculadora científica',
    description: 'Calculadora con funciones científicas',
    price: 45.00,
    stock: 40,
    sku: 'CAL-001',
    category: 'Matemáticas',
    isActive: true
  }
];

async function main() {
  try {
    console.log('🛍️ Creando productos básicos de prueba...');

    for (const product of products) {
      const created = await prisma.product.create({
        data: product
      });
      console.log(`✅ Creado: ${created.name} (${created.sku})`);
    }

    console.log(`🎉 ${products.length} productos creados exitosamente!`);

    // Mostrar productos creados
    const allProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    console.log('\n📋 Productos disponibles:');
    allProducts.forEach(p => {
      console.log(`  - ${p.name} (Stock: ${p.stock}, Precio: $${p.price})`);
    });

  } catch (error) {
    console.error('❌ Error creando productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
