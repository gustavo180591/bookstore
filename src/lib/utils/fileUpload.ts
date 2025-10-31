// Base URL for uploaded files
const UPLOADS_BASE_URL = '/uploads';

export async function handleFileUpload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al subir el archivo');
    }

    const data = await response.json();
    return `${UPLOADS_BASE_URL}/${data.filename}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
