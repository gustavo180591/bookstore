<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Loader2, Heart, ShoppingCart, X } from 'lucide-svelte';
  
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
    addedAt: string;
  }

  let favorites = $state<Product[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let addingToCart = $state<Record<string, boolean>>({});
  let removing = $state<Record<string, boolean>>({});

  // Format price as CLP
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Format date
  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  // Calculate discount percentage
  function calculateDiscount(price: number, originalPrice: number): number {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  // Fetch favorites on mount
  onMount(async () => {
    await loadFavorites();
  });

  // Load favorites from API
  async function loadFavorites() {
    try {
      loading = true;
      // In a real app, this would be an API call
      // const response = await fetch('/api/account/favorites');
      // favorites = await response.json();
      
      // Mock data
      setTimeout(() => {
        favorites = [
          {
            id: '1',
            name: 'Cien años de soledad',
            description: 'Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el mítico pueblo de Macondo.',
            price: 12990,
            originalPrice: 14990,
            discount: 13,
            imageUrl: '/uploads/cien-anos-soledad.jpg',
            category: 'Literatura',
            stock: 15,
            addedAt: '2023-10-25T14:30:00Z'
          },
          {
            id: '2',
            name: 'El principito',
            description: 'Un clásico de la literatura universal que ha cautivado a lectores de todas las edades con su narrativa poética y sus profundas reflexiones sobre la vida.',
            price: 8990,
            originalPrice: 9990,
            discount: 10,
            imageUrl: '/uploads/el-principito.jpg',
            category: 'Literatura Infantil',
            stock: 8,
            addedAt: '2023-10-20T09:15:00Z'
          },
          {
            id: '3',
            name: '1984',
            description: 'Una distopía que explora temas de vigilancia gubernamental, manipulación de la verdad y la naturaleza del poder en una sociedad totalitaria.',
            price: 10990,
            originalPrice: 10990,
            discount: 0,
            imageUrl: '/uploads/1984.jpg',
            category: 'Ciencia Ficción',
            stock: 5,
            addedAt: '2023-10-15T16:45:00Z'
          }
        ];
        loading = false;
      }, 800);
    } catch (err) {
      console.error('Error loading favorites:', err);
      error = 'No se pudieron cargar tus productos favoritos. Por favor, intente nuevamente.';
      loading = false;
    }
  }

  // Add to cart
  async function addToCart(productId: string) {
    try {
      addingToCart = { ...addingToCart, [productId]: true };
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/cart', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ productId, quantity: 1 })
      // });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success message
      showToast('Producto agregado al carrito', 'success');
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast('Error al agregar al carrito', 'error');
    } finally {
      addingToCart = { ...addingToCart, [productId]: false };
    }
  }

  // Remove from favorites
  async function removeFromFavorite(productId: string) {
    try {
      removing = { ...removing, [productId]: true };
      
      // In a real app, this would be an API call
      // await fetch(`/api/account/favorites/${productId}`, { method: 'DELETE' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      favorites = favorites.filter(p => p.id !== productId);
      
      showToast('Producto eliminado de favoritos', 'success');
    } catch (err) {
      console.error('Error removing from favorites:', err);
      showToast('Error al eliminar de favoritos', 'error');
    } finally {
      removing = { ...removing, [productId]: false };
    }
  }

  // Show toast notification
  function showToast(message: string, type: 'success' | 'error' = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    toast.innerHTML = `
      <span>${message}</span>
      <button class="ml-4" onclick="this.parentElement.remove()">
        <X class="h-5 w-5" />
      </button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
    <p class="mt-1 text-sm text-gray-500">
      {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'} guardados
    </p>
  </div>

  {#if error}
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
  {/if}

  <!-- Loading State -->
  {#if loading}
    <div class="flex justify-center items-center py-20">
      <Loader2 class="animate-spin h-12 w-12 text-indigo-600" />
    </div>
  
  <!-- Empty State -->
  {:else if favorites.length === 0}
    <div class="text-center py-16 bg-white rounded-lg shadow">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
        <Heart class="h-8 w-8 text-indigo-600" />
      </div>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No tienes productos favoritos</h3>
      <p class="mt-1 text-sm text-gray-500">Guarda tus productos favoritos para verlos aquí más tarde.</p>
      <div class="mt-6">
        <a
          href="/catalogo"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
          Explorar catálogo
        </a>
      </div>
    </div>
  
  <!-- Favorites List -->
  {:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each favorites as product (product.id)}
        <div 
          class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
          in:fade
        >
          <div class="relative pb-3/4">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              class="h-48 w-full object-cover"
              loading="lazy"
            />
            {#if product.discount > 0}
              <div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{product.discount}%
              </div>
            {/if}
            <button
              class="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
              on:click|preventDefault={() => removeFromFavorite(product.id)}
              disabled={removing[product.id]}
              aria-label="Eliminar de favoritos"
            >
              {#if removing[product.id]}
                <Loader2 class="h-5 w-5 animate-spin" />
              {:else}
                <Heart class="h-5 w-5 fill-current" />
              {/if}
            </button>
          </div>
          
          <div class="p-4 flex-1 flex flex-col">
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-2 h-12">
                {product.name}
              </h3>
              <p class="mt-1 text-sm text-gray-500 line-clamp-2 h-10">
                {product.description}
              </p>
              
              <div class="mt-2">
                {#if product.discount > 0}
                  <div class="flex items-center">
                    <span class="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <span class="ml-2 text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>
                {:else}
                  <span class="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                {/if}
              </div>
              
              <div class="mt-2 text-xs text-gray-400">
                Agregado el {formatDate(product.addedAt)}
              </div>
            </div>
            
            <div class="mt-4">
              <button
                type="button"
                class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                on:click|preventDefault={() => addToCart(product.id)}
                disabled={product.stock === 0 || addingToCart[product.id]}
              >
                {#if addingToCart[product.id]}
                  <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Agregando...
                {:else}
                  <ShoppingCart class="-ml-1 mr-2 h-4 w-4" />
                  {product.stock > 0 ? 'Añadir al carrito' : 'Sin stock'}
                {/if}
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Pagination can be added here if needed -->
    <!-- <div class="mt-8 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Anterior</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </a>
        <a href="#" aria-current="page" class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
          1
        </a>
        <a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
          2
        </a>
        <a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
          3
        </a>
        <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Siguiente</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </a>
      </nav>
    </div> -->
  {/if}
</div>
