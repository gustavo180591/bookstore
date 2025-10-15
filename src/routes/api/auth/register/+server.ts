import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
export async function POST({ request }) {
  try {
    const { email, password, firstName, lastName, documentType, documentNumber, phone } = await request.json();

    // Validar datos requeridos
    if (!email || !password || !firstName || !lastName || !documentType || !documentNumber) {
      return json({
        success: false,
        error: 'Todos los campos marcados con * son requeridos'
      }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({
        success: false,
        error: 'Formato de email inválido'
      }, { status: 400 });
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      return json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      }, { status: 400 });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return json({
        success: false,
        error: 'Este email ya está registrado'
      }, { status: 409 });
    }

    // Verificar si el documento ya existe
    const existingDocument = await prisma.user.findFirst({
      where: { documentNumber }
    });

    if (existingDocument) {
      return json({
        success: false,
        error: 'Este número de documento ya está registrado'
      }, { status: 409 });
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        documentType,
        documentNumber,
        phone,
        role: 'CUSTOMER',
        acceptsMarketing: false
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    return json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: newUser
    });

  } catch (error) {
    console.error('Error registrando usuario:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
