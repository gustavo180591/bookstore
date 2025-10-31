<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  
  interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    discount: number;
    imageUrl: string;
    category: string;
    stock: number;
  }
  
  let products = $state<Product[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  
  // Format price as CLP
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate discount percentage
  const calculateDiscount = (price: number, originalPrice: number): number => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Add to cart function
  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al agregar al carrito');
      }
      
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      toast.textContent = 'Producto agregado al carrito';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
      
    } catch (err) {
      console.error('Error:', err);
      // Show error message
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      toast.textContent = 'Error al agregar al carrito';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  };
  
  // Fetch products on mount
  onMount(async () => {
    try {
      loading = true;
      const response = await fetch('/api/products/offers');
      
      if (!response.ok) {
        throw new Error('Error al cargar las ofertas');
      }
      
      const data = await response.json();
      products = data.data || [];
    } catch (err) {
      console.error('Error:', err);
      error = 'No se pudieron cargar las ofertas. Por favor, intenta de nuevo más tarde.';
    } finally {
      loading = false;
    }
  });
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-2">🔥 Ofertas Especiales</h1>
      <p class="text-lg text-gray-600">Aprovecha estos increíbles descuentos por tiempo limitado</p>
    </div>
    
    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    
    <!-- Error State -->
    {:else if error}
      <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    
    <!-- Products Grid -->
    {:else if products.length > 0}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each products as product (product.id)}
          <div 
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            in:fade
          >
            <!-- Product Image -->
            <div class="relative h-48 bg-gray-100 overflow-hidden">
              {#if product.imageUrl}
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  class="w-full h-full object-cover"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center bg-gray-200">
                  <span class="text-gray-400">Sin imagen</span>
                </div>
              {/if}
              
              <!-- Discount Badge -->
              <div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{calculateDiscount(product.price, product.originalPrice)}%
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <!-- Price -->
              <div class="mt-4">
                <div class="flex items-center">
                  <span class="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                  <span class="ml-2 text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                </div>
                <div class="text-sm text-green-600 mt-1">
                  Ahorras {formatPrice(product.originalPrice - product.price)}
                </div>
              </div>
              
              <!-- Stock Status -->
              {#if product.stock > 0}
                <div class="mt-2 text-sm text-green-600">
                  {product.stock} en stock
                </div>
              {:else}
                <div class="mt-2 text-sm text-red-600">
                  Agotado
                </div>
              {/if}
              
              <!-- Add to Cart Button -->
              <button
                class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
                on:click|preventDefault={() => addToCart(product.id)}
              >
                {product.stock > 0 ? 'Añadir al carrito' : 'Sin stock'}
              </button>
            </div>
          </div>
        {/each}
      </div>
    
    <!-- Empty State -->
    {:else}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No hay ofertas disponibles</h3>
        <p class="mt-1 text-sm text-gray-500">Vuelve más tarde para ver nuestras ofertas especiales.</p>
      </div>
    {/if}
  </div>
</div>


<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
  }
  
  /* Removed unused .line-clamp-1 class */
</style>
