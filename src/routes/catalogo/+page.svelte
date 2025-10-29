<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { PageData } from './$types';
  import { fetchProducts, fetchCategories, type Product } from '$lib/api/products';
  import { cartActions } from '$lib/stores/cart';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  // Función para validar URLs
  function isValidUrl(string: string | undefined | null): boolean {
    if (!string) return false;
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }
  
  // Función para manejar errores de carga de imagen
  function handleImageError(img: HTMLImageElement) {
    const placeholder = img.nextElementSibling as HTMLElement;
    if (placeholder && placeholder.classList.contains('product-placeholder')) {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    }
  }

  // Define user type
  interface User {
    role: 'ADMIN' | 'USER';
    // Add other user properties as needed
  }

  // State with $state for reactivity
  let products = $state<Product[]>([]);
  let categories = $state<string[]>([]);
  let loading = $state(true);
  let loadingTimedOut = $state(false);
  let error = $state<string | null>(null);
  let addingToCart = $state<Record<string, boolean>>({});
  let notification = $state<{message: string, type: 'success' | 'error'} | null>(null);
  let isAdmin = $state(false);
  let searchTerm = $state('');
  let selectedCategory = $state('');
  
  // Timeout para el estado de carga
  const loadingTimeout = setTimeout(() => {
    if (loading) {
      loadingTimedOut = true;
    }
  }, 3000);
  
  // Limpiar el timeout cuando el componente se desmonte
  onDestroy(() => clearTimeout(loadingTimeout));

  // Verificar si el usuario es administrador
  $effect(() => {
    const data = $page.data as { user?: User };
    isAdmin = data?.user?.role === 'ADMIN';
  });
  
  // Mostrar notificación
  function showNotification(message: string, type: 'success' | 'error' = 'success') {
    notification = { message, type };
    setTimeout(() => {
      notification = null;
    }, 3000);
  }


  // Cargar datos iniciales
  onMount(async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetchProducts({ limit: 12 }),
        fetchCategories()
      ]);

      products = productsResponse.data;
      categories = categoriesResponse;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      loading = false;
    }
  });

  // Funciones para manejar filtros
  async function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    searchTerm = target.value;

    try {
      loading = true;
      const response = await fetchProducts({
        search: searchTerm,
        category: selectedCategory || undefined,
        limit: 12
      });
      products = response.data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error de búsqueda';
    } finally {
      loading = false;
    }
  }

  async function handleCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedCategory = target.value;

    try {
      loading = true;
      const response = await fetchProducts({
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        limit: 12
      });
      products = response.data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error de filtro';
    } finally {
      loading = false;
    }
  }

  async function resetFilters() {
    searchTerm = '';
    selectedCategory = '';

    try {
      loading = true;
      const response = await fetchProducts({ limit: 12 });
      products = response.data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al resetear';
    } finally {
      loading = false;
    }
  }

  function formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(numPrice);
  }
</script>

<svelte:head>
  <title>Catálogo de Productos - Bookstore</title>
  <meta name="description" content="Explora nuestro catálogo de productos escolares y de oficina" />
</svelte:head>

<!-- Notificación flotante -->
{#if notification}
  <div class="notification {notification.type}">
    {notification.message}
  </div>
{/if}

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">📚 Catálogo de Productos</h1>
      {#if isAdmin}
        <a 
          href="/admin/productos/nuevo"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Agregar producto"
        >
          <svg class="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Agregar producto
        </a>
      {/if}
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <!-- Sidebar con filtros -->
      <aside class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 mb-4">🔍 Filtros</h3>

          <!-- Búsqueda -->
          <div class="filter-group">
            <label for="search" class="filter-label">
              Buscar productos
            </label>
            <input
              type="text"
              id="search"
              placeholder="Nombre, descripción..."
              class="filter-input"
              bind:value={searchTerm}
              oninput={handleSearch}
            />
          </div>

          <!-- Categoría -->
          <div class="filter-group">
            <label for="category" class="filter-label">
              Categoría
            </label>
            <select
              id="category"
              class="filter-select"
              bind:value={selectedCategory}
              onchange={handleCategoryChange}
            >
              <option value="">Todas las categorías</option>
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>

          <!-- Botón de reset -->
          <div class="filter-group">
            <button
              type="button"
              class="reset-button"
              onclick={resetFilters}
            >
              🔄 Limpiar filtros
            </button>
          </div>
        </div>
      </aside>

      <!-- Contenido principal -->
      <main class="lg:col-span-3">
        <!-- Empty state - shown immediately while loading or when no products -->
        {#if (loading || products.length === 0) && !error}
          <div class="bg-white p-8 rounded-lg shadow-sm text-center">
            <div class="max-w-md mx-auto">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                {loading && !loadingTimedOut ? 'Cargando catálogo...' : 'No hay productos disponibles'}
              </h3>
              {#if !loading || loadingTimedOut}
                <p class="text-gray-600 mb-6">
                  {loadingTimedOut 
                    ? 'El catálogo está tardando en cargar. ' + (!isAdmin ? 'Por favor, vuelve a intentarlo más tarde.' : '')
                    : 'Actualmente no hay productos disponibles en el catálogo.' + (!isAdmin ? ' Por favor, vuelve a intentarlo más tarde.' : '')
                  }
                </p>
              {/if}
              {#if isAdmin}
                <a 
                  href="/admin/productos/nuevo"
                  class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors {loading ? 'opacity-75' : ''}"
                  class:opacity-75={loading}
                >
                  <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  {loading ? 'Cargando...' : 'Agregar mi primer producto'}
                </a>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Error state -->
        {#if error}
          <div class="error-container">
            <div class="error-content">
              <h3 class="error-title">
                Error al cargar productos
              </h3>
              <div class="error-message">
                <p>{error}</p>
              </div>
              <div class="error-actions">
                <button
                  type="button"
                  class="retry-button"
                  onclick={async () => {
                    error = null;
                    loading = true;
                    try {
                      const [productsResponse, categoriesResponse] = await Promise.all([
                        fetchProducts({ limit: 12 }),
                        fetchCategories()
                      ]);
                      products = productsResponse.data;
                      categories = categoriesResponse;
                    } catch (err) {
                      error = err instanceof Error ? err.message : 'Error desconocido';
                    } finally {
                      loading = false;
                    }
                  }}
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        {/if}

        <!-- Productos -->
        {#if !loading && !error && products.length > 0}
          <div class="products-info">
            <p class="products-count">
              {products.length} productos encontrados
            </p>
          </div>

          <div class="products-grid">
            {#each products as product (product.id)}
              <div class="product-card">
                <!-- Imagen del producto -->
                <div class="product-image">
                  {#if product.imageUrl && isValidUrl(product.imageUrl)}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      class="product-img"
                      onerror={(e) => handleImageError(e.currentTarget as HTMLImageElement)}
                    />
                    <div class="product-placeholder" style="display: none;">
                      <span class="placeholder-icon">📚</span>
                    </div>
                  {:else}
                    <div class="product-placeholder">
                      <span class="placeholder-icon">📚</span>
                    </div>
                  {/if}
                </div>

                <!-- Información del producto -->
                <div class="product-info">
                  <div class="product-meta">
                    {#if product.category}
                      <span class="product-category">
                        {product.category}
                      </span>
                    {/if}
                  </div>

                  <h3 class="product-name">
                    {product.name}
                  </h3>

                  {#if product.description}
                    <p class="product-description">
                      {product.description}
                    </p>
                  {/if}

                  <!-- Precio y stock -->
                  <div class="product-details">
                    <span class="product-price">
                      {formatPrice(product.price)}
                    </span>

                    {#if product.stock > 0}
                      <span class="product-stock">
                        Stock: {product.stock}
                      </span>
                    {:else}
                      <span class="product-out-of-stock">
                        Agotado
                      </span>
                    {/if}
                  </div>

                  <!-- SKU (opcional) -->
                  {#if product.sku}
                    <p class="product-sku">
                      SKU: {product.sku}
                    </p>
                  {/if}

                  <!-- Botón de acción -->
                  <button
                    class="add-to-cart-button"
                    disabled={product.stock === 0 || addingToCart[product.id]}
                    onclick={async () => {
                      if (product.stock === 0) return;
                      
                      try {
                        addingToCart = { ...addingToCart, [product.id]: true };
                        const result = await cartActions.addToCart(product.id, 1);
                        if (result.success) {
                          showNotification(`${product.name} agregado al carrito`, 'success');
                        } else {
                          showNotification(result.error || 'Error al agregar al carrito', 'error');
                        }
                      } catch (error) {
                        console.error('Error adding to cart:', error);
                        showNotification('Error al agregar al carrito', 'error');
                      } finally {
                        addingToCart = { ...addingToCart, [product.id]: false };
                      }
                    }}
                  >
                    {#if addingToCart[product.id]}
                      Agregando...
                    {:else if product.stock === 0}
                      No disponible
                    {:else}
                      Agregar al carrito
                    {/if}
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}

        <!-- Sin productos -->
        {#if !loading && !error && products.length === 0}
          <div class="no-products">
            <p class="no-products-text">No se encontraron productos</p>
            <button
              class="show-all-button"
              onclick={resetFilters}
            >
              Ver todos los productos
            </button>
          </div>
        {/if}
      </main>
    </div>
  </div>
</div>

<style>
  /* Estilos para notificaciones */
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  }
  
  .success {
    background-color: #10b981; /* green-500 */
  }
  
  .error {
    background-color: #ef4444; /* red-500 */
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .min-h-screen {
    min-height: 100vh;
  }

  .bg-gray-50 {
    background-color: #f9fafb;
  }

  .header {
    background-color: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e5e7eb;
  }

  .header-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
  }

  .title {
    margin: 0;
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
  }

  .create-product-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
  }

  .create-product-btn:hover {
    background-color: #2563eb;
  }

  .cart-link {
    color: #2563eb;
    font-weight: 500;
  }

  .cart-link:hover {
    color: #1d4ed8;
  }

  .main-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 2rem;
  }

  .sidebar {
    position: sticky;
    top: 2rem;
    height: fit-content;
  }

  .filters-card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }

  .filters-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
  }

  .filter-group {
    margin-bottom: 1.5rem;
  }

  .filter-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .filter-input, .filter-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .filter-input:focus, .filter-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  .reset-button {
    width: 100%;
    background-color: #f3f4f6;
    color: #374151;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
  }

  .reset-button:hover {
    background-color: #e5e7eb;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 16rem;
  }

  .spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    margin-left: 0.75rem;
    color: #6b7280;
  }

  .error-container {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.375rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .error-content {
    display: flex;
    flex-direction: column;
  }

  .error-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #dc2626;
  }

  .error-message {
    margin-top: 0.5rem;
  }

  .error-message p {
    color: #991b1b;
    font-size: 0.875rem;
  }

  .error-actions {
    margin-top: 1rem;
  }

  .retry-button {
    background-color: #dc2626;
    color: white;
    padding: 0.375rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
  }

  .retry-button:hover {
    background-color: #b91c1c;
  }

  .products-info {
    margin-bottom: 1.5rem;
  }

  .products-count {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .product-card {
    background-color: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
  }

  .product-card:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .product-image {
    aspect-ratio: 1;
    background-color: #f3f4f6;
  }

  .product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder-icon {
    font-size: 2.5rem;
  }

  .product-info {
    padding: 1rem;
  }

  .product-meta {
    margin-bottom: 0.5rem;
  }

  .product-category {
    display: inline-block;
    background-color: #dbeafe;
    color: #1e40af;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-weight: 500;
  }

  .product-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  .product-description {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .product-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .product-price {
    font-size: 1.25rem;
    font-weight: bold;
    color: #059669;
  }

  .product-stock {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .product-out-of-stock {
    font-size: 0.875rem;
    color: #dc2626;
    font-weight: 500;
  }

  .product-sku {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-bottom: 0.75rem;
  }

  .add-to-cart-button {
    width: 100%;
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .add-to-cart-button:hover:not(:disabled) {
    background-color: #1d4ed8;
  }

  .add-to-cart-button:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }

  .no-products {
    text-align: center;
    padding: 3rem 0;
  }

  .no-products-text {
    color: #6b7280;
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .show-all-button {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
  }

  .show-all-button:hover {
    background-color: #1d4ed8;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .content-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .main-container {
      padding: 1rem;
    }
  }
</style>
