import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/test-db
 * Test database connection
 */
export async function GET() {
  try {
    // Test basic connection
    await prisma.$connect();

    // Test if we can query
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    return json({
      success: true,
      message: 'Database connection successful',
      data: {
        test: result,
        connection: 'OK'
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return json({
      success: false,
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
