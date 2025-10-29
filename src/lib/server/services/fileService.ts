import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'static', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function uploadFile(file: File): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: 'Tipo de archivo no permitido' };
    }

    // Validar tamaño de archivo
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'El archivo es demasiado grande (máx. 10MB)' };
    }

    // Crear directorio de subidas si no existe
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop() || '';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path.join('uploads', fileName);
    const fullPath = path.join(UPLOAD_DIR, fileName);

    // Guardar archivo
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(fullPath, buffer);

    return { success: true, path: `/${filePath}` };
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return { success: false, error: 'Error al subir el archivo' };
  }
}

export async function deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Prevenir eliminación fuera del directorio de subidas
    const fullPath = path.join(process.cwd(), 'static', filePath);
    if (!fullPath.startsWith(UPLOAD_DIR)) {
      return { success: false, error: 'Ruta de archivo no permitida' };
    }

    await fs.unlink(fullPath);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return { success: false, error: 'Error al eliminar el archivo' };
  }
}
