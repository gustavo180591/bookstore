#!/usr/bin/env node

/**
 * Script para crear usuario de prueba
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('👤 Creando usuario de prueba...');

    // Crear usuario de prueba
    const user = await prisma.user.create({
      data: {
        email: 'test@bookstore.com',
        passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
        role: 'CUSTOMER',
        documentType: 'DNI',
        documentNumber: '12345678',
        firstName: 'Usuario',
        lastName: 'Prueba',
        phone: '1234567890',
        acceptsMarketing: false
      }
    });

    console.log(`✅ Usuario creado: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Nombre: ${user.firstName} ${user.lastName}`);

    // Verificar que el usuario se creó correctamente
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    console.log('\n📋 Usuarios en la base de datos:');
    allUsers.forEach(u => {
      console.log(`  - ${u.firstName} ${u.lastName} (${u.email}) - ${u.role}`);
    });

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
