import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// Tipo para la función de parseo de PDF
type PdfParseFunction = (data: Uint8Array) => Promise<{ text: string }>;

// Variable para almacenar la función de parseo
let pdfParsePromise: Promise<PdfParseFunction> | null = null;

// Función para obtener la instancia de pdf-parse
async function getPdfParser(): Promise<PdfParseFunction> {
  if (!browser) {
    throw new Error('pdf-parse solo está disponible en el navegador');
  }

  if (!pdfParsePromise) {
    pdfParsePromise = (async () => {
      try {
        // Use pdfjs-dist directly for better browser compatibility
        const pdfjsLib = await import('pdfjs-dist');

        // Configure worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

        // Return a function that parses PDF data using pdfjs-dist
        return async (data: Uint8Array) => {
          try {
            // Load the PDF document
            const pdf = await pdfjsLib.getDocument({ data }).promise;

            let fullText = '';

            // Extract text from all pages
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .filter((item: unknown) => item && typeof item === 'object' && item !== null && 'str' in item)
                .map((item: unknown) => (item as { str: string }).str)
                .join(' ');
              fullText += pageText + '\n';
            }

            return { text: fullText };
          } catch (error) {
            console.error('Error parsing PDF:', error);
            throw new Error('No se pudo extraer texto del PDF');
          }
        };
      } catch (error) {
        console.error('Error al cargar pdfjs-dist:', error);
        throw new Error('No se pudo cargar el módulo de procesamiento de PDF');
      }
    })();
  }

  return pdfParsePromise as unknown as PdfParseFunction;
}

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  inStock: boolean;
}

export interface ListaUtilesItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  matchedProduct?: Product;
  alternatives?: Product[];
  manuallyAdded?: boolean;
  deleted?: boolean;
}

export interface ListaUtilesState {
  status: 'idle' | 'uploading' | 'processing' | 'processed' | 'error';
  items: ListaUtilesItem[];
  originalFile?: File;
  processedAt?: Date;
  total: number;
  error?: string;
}

// Initial state
const initialState: ListaUtilesState = {
  status: 'idle',
  items: [],
  total: 0,
};

// Create store
const createListaUtilesStore = () => {
  const { subscribe, set, update } = writable<ListaUtilesState>(
    browser ? JSON.parse(localStorage.getItem('listaUtiles') || 'null') || initialState : initialState
  );

  // Persist to localStorage
  if (browser) {
    subscribe(value => {
      localStorage.setItem('listaUtiles', JSON.stringify(value));
    });
  }

  return {
    subscribe,
    updateItem: (itemId: string, updates: Partial<ListaUtilesItem>) => {
      update(state => ({
        ...state,
        items: state.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      }));
    },
    deleteItem: (itemId: string) => {
      update(state => ({
        ...state,
        items: state.items.filter(item => item.id !== itemId),
      }));
    },
    processLista: async (file: File) => {
      try {
        update((state: ListaUtilesState) => ({
          ...state,
          status: 'uploading',
          originalFile: file,
          error: undefined,
        }));

        // Leer el archivo como ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Convertir a Uint8Array que es compatible con el navegador
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Extraer texto del PDF
        // Obtener la función de parseo de PDF
        const pdfParser = await getPdfParser();
        
        // Usar la función de parseo de PDF
        const data = await pdfParser(uint8Array);
        const text = data.text;
        
        // Procesar el texto para extraer los elementos de la lista
        // El PDF tiene formato: "2 ×   Lápiz negro HB" - intentar separar por múltiples espacios
        let lines = text.split(/\s{3,}/).filter((line: string) => line.trim() !== '');

        // Si no funcionó, intentar otros separadores
        if (lines.length <= 3) {
          lines = text.split(/\s{2,}|\t+|\n+/).filter((line: string) => line.trim() !== '');
        }

        // Si sigue sin funcionar, usar expresión regular para encontrar patrones de cantidad
        if (lines.length <= 3) {
          const quantityMatches = text.matchAll(/(\d+)\s*×?\s*(.+?)(?=\s*\d+\s*×?|$)/g);
          lines = Array.from(quantityMatches, match => match[0].trim()).filter(line => line);
        }

        // Debug: Log the extracted text and lines for debugging
        console.log('PDF Text extracted:', text);
        console.log('Lines found after splitting:', lines.length);
        console.log('Sample lines:', lines.slice(0, 5));

        // Múltiples patrones para identificar elementos de la lista
        const patterns = [
          // Patrón 1: Número + × + nombre (ej: "2 × Lápiz negro HB")
          /^(\d+)\s*×?\s*(.+)$/i,
          // Patrón 2: Número + espacio + nombre + opcional (número + unidades)
          /^(\d+)\s+(.+?)(?:\s+(\d+)\s*(?:unid|unidades?|pzas?|pz|u|unidad|pieza|piezas)?)?$/i,
          // Patrón 3: Número + punto + nombre
          /^(\d+)\.\s*(.+)$/i,
          // Patrón 4: Viñeta + nombre
          /^[•\-*•]\s*(.+)$/i,
          // Patrón 5: Solo nombre (sin cantidad específica) - solo líneas que empiecen con letra
          /^[A-Za-zÁÉÍÓÚáéíóúñÑ].+$/,
          // Patrón 6: Nombre + cantidad con "x"
          /^(.+?)\s*x\s*(\d+)$/i,
          // Patrón 7: Nombre + cantidad entre paréntesis
          /^(.+?)\s*\((\d+)\)$/i,
          // Patrón 8: Nombre + guion + cantidad
          /^(.+?)\s*-\s*(\d+)$/i
        ];

        // También buscar patrones donde el número viene después del nombre
        const reversePatterns = [
          // Patrón donde cantidad viene al final: "Lápiz negro HB 2 ×"
          /^(.+?)\s+(\d+)\s*×?\s*$/i
        ];

        // Obtener productos disponibles para hacer matching
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();

        if (!productsData.success) {
          throw new Error('Error obteniendo productos');
        }

        const availableProducts = productsData.data;
        const identifiedItems: ListaUtilesItem[] = [];

        // Procesar cada línea del texto
        lines.forEach((line: string, index: number) => {
          const cleanLine = line?.trim();
          if (!cleanLine || cleanLine.length < 2) return;

          console.log(`Processing line ${index}: "${cleanLine}"`);

          let match = null;
          let quantity = 1;
          let itemName = cleanLine;

          // Probar cada patrón normal
          for (const pattern of patterns) {
            match = cleanLine.match(pattern);
            if (match) {
              console.log(`Pattern matched: ${pattern}, groups:`, match.slice(1));

              if (pattern === patterns[0]) {
                // Patrón 1: número + × + nombre
                quantity = parseInt(match[1], 10) || 1;
                itemName = match[2]?.trim() || cleanLine;
              } else if (pattern === patterns[1]) {
                // Patrón 2: número + nombre + opcional número
                quantity = parseInt(match[3] || match[1], 10) || 1;
                itemName = match[2]?.trim() || cleanLine;
              } else if (pattern === patterns[2]) {
                // Patrón 3: número + punto + nombre
                quantity = parseInt(match[1], 10) || 1;
                itemName = match[2]?.trim() || cleanLine;
              } else if (pattern === patterns[3]) {
                // Patrón 4: viñeta + nombre
                itemName = match[1]?.trim() || cleanLine;
              } else if (pattern === patterns[4]) {
                // Patrón 5: solo nombre
                itemName = match[1]?.trim() || cleanLine;
              } else if (pattern === patterns[5]) {
                // Patrón 6: nombre + x + cantidad
                itemName = match[1]?.trim() || cleanLine;
                quantity = parseInt(match[2], 10) || 1;
              } else if (pattern === patterns[6]) {
                // Patrón 7: nombre + (cantidad)
                itemName = match[1]?.trim() || cleanLine;
                quantity = parseInt(match[2], 10) || 1;
              } else if (pattern === patterns[7]) {
                // Patrón 8: nombre - cantidad
                itemName = match[1]?.trim() || cleanLine;
                quantity = parseInt(match[2], 10) || 1;
              }
              break;
            }
          }

          // Si no match, probar patrones inversos
          if (!match) {
            for (const pattern of reversePatterns) {
              match = cleanLine.match(pattern);
              if (match) {
                console.log(`Reverse pattern matched: ${pattern}, groups:`, match.slice(1));
                itemName = match[1]?.trim() || cleanLine;
                quantity = parseInt(match[2], 10) || 1;
                break;
              }
            }
          }

          // Solo procesar si el nombre del ítem tiene sentido (mínimo 3 caracteres, no solo números/puntuación)
          if (itemName && itemName.length > 2 && !/^\d+[.\s]*$/.test(itemName)) {
            console.log(`Processing item: "${itemName}" (quantity: ${quantity})`);

            // Buscar coincidencia aproximada con productos existentes
            const normalizedItemName = itemName.toLowerCase().trim();
            const matchedProduct = availableProducts.find((product: { name: string }) =>
              product.name.toLowerCase().includes(normalizedItemName) ||
              normalizedItemName.includes(product.name.toLowerCase()) ||
              // También buscar por palabras individuales
              normalizedItemName.split(' ').some((word: string) =>
                word.length > 2 && product.name.toLowerCase().includes(word)
              )
            );

            // Crear el ítem identificado
            const item: ListaUtilesItem = {
              id: `item-${index + 1}`,
              name: itemName.trim(),
              quantity: quantity,
              unit: 'unid',
            };

            if (matchedProduct) {
              item.matchedProduct = {
                id: matchedProduct.id,
                name: matchedProduct.name,
                price: Number(matchedProduct.price),
                image: matchedProduct.imageUrl || '/images/products/placeholder.jpg',
                brand: matchedProduct.category || 'Genérico',
                inStock: matchedProduct.stock > 0,
              };

              // Buscar alternativas similares
              const alternatives = availableProducts
                .filter((p: { id: string; name: string }) =>
                  p.id !== matchedProduct.id &&
                  p.name.toLowerCase().includes(normalizedItemName.split(' ')[0])
                )
                .slice(0, 3)
                .map((p: { id: string; name: string; price: string; imageUrl?: string; category?: string; stock: number }) => ({
                  id: p.id,
                  name: p.name,
                  price: Number(p.price),
                  image: p.imageUrl || '/images/products/placeholder.jpg',
                  brand: p.category || 'Genérico',
                  inStock: p.stock > 0,
                }));

              if (alternatives.length > 0) {
                item.alternatives = alternatives;
              }
            }

            identifiedItems.push(item);
          }
        });

        console.log('Items identified:', identifiedItems.length, identifiedItems.map(i => `${i.name} (${i.quantity})`));
        
        // Si no se identificaron ítems, lanzar error
        if (identifiedItems.length === 0) {
          throw new Error('No se pudieron identificar elementos en la lista. Asegúrate de que el archivo contenga una lista de útiles legible.');
        }
        
        // Calcular el total
        const total = identifiedItems.reduce(
          (sum, item) => sum + (item.matchedProduct?.price || 0) * item.quantity,
          0
        );

        // Actualizar el estado con los ítems identificados
        update((state: ListaUtilesState) => ({
          ...state,
          status: 'processed',
          items: identifiedItems,
          total,
          processedAt: new Date(),
          error: undefined
        }));

      } catch (error) {
        console.error('Error al procesar la lista de útiles:', error);
        update((state: ListaUtilesState) => ({
          ...state,
          status: 'error',
          error: error instanceof Error ? error.message : 'No pudimos procesar tu lista. Por favor, asegúrate de que el archivo sea un PDF válido y contenga una lista de útiles legible.',
        }));
      }
    },
    clear: () => set(initialState),
  };
};

export const listaUtilesStore = createListaUtilesStore();

export const processListaUtiles = (file: File) => listaUtilesStore.processLista(file);

// Tipo para el resumen de la lista de útiles
export interface ListaUtilesSummary {
  title: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    unitPrice?: number;
    totalPrice?: number;
  }>;
  totalItems: number;
  totalPrice: number;
  status: string;
}

// Función para generar un resumen estructurado de los productos identificados
export function getListaUtilesSummary(): ListaUtilesSummary {
  const summary: ListaUtilesSummary = {
    title: 'Resumen de la lista de útiles',
    items: [],
    totalItems: 0,
    totalPrice: 0,
    status: 'idle'
  };

  // Usamos get para obtener el estado actual del store
  const state = get(listaUtilesStore);
  
  if (state.status === 'processed' && state.items.length > 0) {
    // Agrupar por producto y sumar cantidades
    const groupedItems: Record<string, {quantity: number, item: ListaUtilesItem}> = {};
    
    state.items.forEach((item: ListaUtilesItem) => {
      const key = item.matchedProduct?.id || item.name;
      if (groupedItems[key]) {
        groupedItems[key].quantity += item.quantity;
      } else {
        groupedItems[key] = {
          quantity: item.quantity,
          item: {...item}
        };
      }
    });
    
    // Crear items del resumen
    summary.items = Object.values(groupedItems).map(({quantity, item}) => {
      const unitPrice = item.matchedProduct?.price;
      const totalPrice = unitPrice ? quantity * unitPrice : undefined;
      
      return {
        name: item.matchedProduct?.name || item.name,
        quantity,
        unit: item.unit || 'unid',
        unitPrice,
        totalPrice
      };
    });
    
    // Calcular total general
    summary.totalItems = state.items.length;
    summary.totalPrice = state.items.reduce((sum: number, item: ListaUtilesItem) => {
      return sum + (item.quantity * (item.matchedProduct?.price || 0));
    }, 0);
    
    summary.status = 'processed';
  } else if (state.status === 'error') {
    summary.status = 'error';
  } else if (state.status === 'uploading' || state.status === 'processing') {
    summary.status = 'processing';
  }
  
  return summary;
}

// Función para formatear el resumen como texto
export function formatListaUtilesSummary(summary: ListaUtilesSummary): string {
  if (summary.status === 'processing') {
    return '🔄 Procesando la lista de útiles...';
  }
  
  if (summary.status === 'error') {
    return '❌ Error al procesar la lista de útiles. Por favor, inténtalo de nuevo.';
  }
  
  if (summary.status !== 'processed' || summary.items.length === 0) {
    return 'Aún no se ha cargado ninguna lista de útiles.';
  }
  
  let formatted = '📋 **Resumen de la lista de útiles escaneada:**\n\n';
  
  // Agregar productos al resumen
  summary.items.forEach(item => {
    formatted += `✅ **${item.name}**\n`;
    formatted += `   - Cantidad: ${item.quantity} ${item.unit}\n`;
    
    if (item.unitPrice !== undefined) {
      formatted += `   - Precio unitario: $${item.unitPrice.toFixed(2)}\n`;
      if (item.totalPrice !== undefined) {
        formatted += `   - Total: $${item.totalPrice.toFixed(2)}\n`;
      }
    }
    
    formatted += '\n';
  });
  
  // Agregar total general
  formatted += `---\n`;
  formatted += `📊 **Total general: $${summary.totalPrice.toFixed(2)}**\n`;
  formatted += `📦 **${summary.totalItems} productos identificados**\n`;
  
  return formatted;
}

// Función para obtener el resumen formateado directamente
export function getFormattedListaUtilesSummary(): string {
  const summary = getListaUtilesSummary();
  return formatListaUtilesSummary(summary);
}
