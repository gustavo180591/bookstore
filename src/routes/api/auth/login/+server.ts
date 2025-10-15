import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * POST /api/auth/login
 * Autentica un usuario y crea una sesión
 */
export async function POST({ request, cookies }) {
  try {
    const { email, password } = await request.json();

    // Validar datos de entrada
    if (!email || !password) {
      return json({
        success: false,
        error: 'Email y contraseña son requeridos'
      }, { status: 400 });
    }

    // Buscar usuario por email - simplified for debugging
    const users = await prisma.user.findMany({
      where: { email }
    });

    if (users.length === 0) {
      return json({
        success: false,
        error: 'Credenciales inválidas'
      }, { status: 401 });
    }

    const user = users[0];

    // Verificar contraseña usando bcrypt
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return json({
        success: false,
        error: 'Credenciales inválidas'
      }, { status: 401 });
    }

    // Crear sesión (expira en 24 horas)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt
      }
    });

    // Configurar cookie de sesión
    cookies.set('sessionId', session.id, {
      path: '/',
      httpOnly: true,
      secure: false, // Cambiar a true en producción con HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 horas en segundos
    });

    // Remover información sensible antes de devolver
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.passwordHash;

    return json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
