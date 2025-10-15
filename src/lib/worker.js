// src/lib/worker.js - Worker para tareas en segundo plano
// Nota: Prisma deshabilitado temporalmente hasta resolver generación en Docker

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Test Redis connection
async function testRedisConnection() {
  try {
    await redis.ping();
    console.log('✅ Redis conectado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a Redis:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Basic Redis operations for the worker
async function redisOperations() {
  try {
    // Set a test key
    await redis.set('worker:last_run', new Date().toISOString());

    // Get the test key
    const lastRun = await redis.get('worker:last_run');
    console.log('Última ejecución del worker:', lastRun);

    // Set worker status
    await redis.set('worker:status', 'running');

    return true;
  } catch (error) {
    console.error('Error en operaciones Redis:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

async function startWorker() {
  console.log('🚀 Iniciando worker...');

  // Test Redis connection
  const redisConnected = await testRedisConnection();
  if (!redisConnected) {
    console.log('⚠️  Continuando sin Redis...');
  }

  // Example: Process Redis queues
  console.log('📋 Procesando trabajos de Redis...');
  await redisOperations();

  console.log('✅ Worker corriendo. Procesando tareas cada minuto.');

  // Keep the process alive and check Redis periodically
  setInterval(async () => {
    try {
      // Update worker status periodically
      await redis.set('worker:last_heartbeat', new Date().toISOString());

      // Check for any pending jobs (future implementation)
      const status = await redis.get('worker:status');
      console.log(`Worker activo - Status: ${status}`);

      // Add more queue processing logic here in the future
    } catch (error) {
      console.error('Error en el intervalo del worker:', error instanceof Error ? error.message : String(error));
    }
  }, 60000); // Every minute
}

startWorker().catch(console.error);
