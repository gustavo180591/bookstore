import { handleSession } from './lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import fs from 'fs/promises';
import path from 'path';
import type { Handle } from '@sveltejs/kit';

// Configuración de rutas
const UPLOAD_DIR = path.join(process.cwd(), 'static', 'uploads');

// Crear directorio de subidas si no existe
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log(`Directorio de subidas listo en: ${UPLOAD_DIR}`);
  } catch (error) {
    console.error('Error al crear el directorio de subidas:', error);
  }
}

// Inicializar el directorio de subidas
ensureUploadDir();

// Middleware para servir archivos estáticos
const handleStaticFiles: Handle = async ({ event, resolve }) => {
  // Solo manejar archivos estáticos en producción o si se solicita explícitamente
  if (event.url.pathname.startsWith('/uploads/') || !dev) {
    const filePath = path.join('static', event.url.pathname);
    
    try {
const buffer = await fs.readFile(filePath);
      const ext = path.extname(filePath).slice(1);
      const contentType = getContentType(ext);
      
      return new Response(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    } catch (error) {
      console.error('Error al servir archivo estático:', error);
      return new Response('Archivo no encontrado', { status: 404 });
    }
  }

  return resolve(event);
}

// Obtener el tipo MIME basado en la extensión del archivo
function getContentType(ext: string): string {
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    pdf: 'application/pdf',
    json: 'application/json',
    js: 'application/javascript',
    css: 'text/css',
    html: 'text/html',
    txt: 'text/plain',
  };
  
  return types[ext.toLowerCase()] || 'application/octet-stream';
}

export const handle = sequence(handleSession, handleStaticFiles);
