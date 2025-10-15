<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchProducts, fetchCategories, type Product } from '$lib/api/products';

  // Estado simple
  let products: Product[] = [];
  let categories: string[] = [];
  let loading = true;
  let error: string | null = null;

  // Estado para filtros
  let searchTerm = '';
  let selectedCategory = '';

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

<div class="app-container">
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      <h1 class="title">📚 Catálogo de Productos</h1>
      <a href="/carrito" class="cart-link">
        🛒 Carrito
      </a>
    </div>
  </header>

  <div class="main-container">
    <div class="content-grid">
      <!-- Sidebar con filtros -->
      <aside class="sidebar">
        <div class="filters-card">
          <h3 class="filters-title">🔍 Filtros</h3>

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
      <main class="main-content">
        <!-- Loading state -->
        {#if loading}
          <div class="loading-container">
            <div class="spinner"></div>
            <span class="loading-text">Cargando productos...</span>
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
                  {#if product.imageUrl}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      class="product-img"
                    />
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
                    disabled={product.stock === 0}
                    onclick={() => alert(`${product.name} agregado al carrito!`)}
                  >
                    {#if product.stock === 0}
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
  .app-container {
    min-height: 100vh;
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
    font-size: 1.5rem;
    font-weight: bold;
    color: #111827;
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
