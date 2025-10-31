import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

// Define upload directory
const UPLOAD_DIR = 'static/uploads';

// Ensure upload directory exists
const __dirname = fileURLToPath(new URL('../../..', import.meta.url));
const uploadDir = join(__dirname, UPLOAD_DIR);

// Create upload directory if it doesn't exist
await mkdir(uploadDir, { recursive: true });

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !(file instanceof File)) {
      return json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExt = extname(file.name);
    const fileName = `${randomUUID()}${fileExt}`;
    const filePath = join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return json({
      success: true,
      filename: fileName,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return json(
      { 
        success: false, 
        error: 'Error uploading file',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
