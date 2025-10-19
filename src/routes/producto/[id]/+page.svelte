<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fetchProduct, type Product } from '$lib/api/products';
  import ProductCard from '$lib/components/ProductCard.svelte';

  // Estado del componente
  let product: Product | null = null;
  let loading = true;
  let error: string | null = null;
  let addingToCart = false;

  // Estado para la galería de imágenes
  let currentImageIndex = 0;
  let selectedQuantity = 1;

  // Productos relacionados (simulado - en el futuro podría ser una API real)
  let relatedProducts: Product[] = [];

  // Función para formatear precios
  function formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(numPrice);
  }

  // Función para cambiar imagen en la galería
  function changeImage(index: number) {
    if (product && index >= 0 && index < getImageUrls().length) {
      currentImageIndex = index;
    }
  }

  // Función para obtener URLs de imágenes
  function getImageUrls(): string[] {
    if (!product) return [];

    const images = [product.imageUrl].filter(Boolean);
    // En el futuro, aquí podrías incluir múltiples imágenes del producto
    return images.length > 0 ? images : ['/placeholder-product.jpg'];
  }

  // Función para agregar al carrito
  async function addToCart() {
    if (!product || addingToCart) return;

    addingToCart = true;
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: selectedQuantity
        })
      });

      const result = await response.json();

      if (result.success) {
        // Redirigir al carrito o mostrar notificación de éxito
        goto('/carrito');
      } else {
        error = result.message || 'Error al agregar al carrito';
      }
    } catch (err) {
      error = 'Error de conexión. Inténtalo nuevamente.';
    } finally {
      addingToCart = false;
    }
  }

  // Función para obtener productos relacionados (simulada)
  async function loadRelatedProducts() {
    if (!product) return;

    try {
      // Simulación: obtener productos de la misma categoría
      const response = await fetch(`/api/products?category=${product.category}&limit=4`);
      if (response.ok) {
        const data = await response.json();
        relatedProducts = data.data.filter((p: Product) => p.id !== product!.id);
      }
    } catch (err) {
      console.error('Error cargando productos relacionados:', err);
    }
  }

  // Cargar producto al montar el componente
  onMount(async () => {
    const { id } = $page.params;

    if (!id) {
      error = 'ID de producto no válido';
      loading = false;
      return;
    }

    try {
      const response = await fetchProduct(id);
      product = response.data;
      await loadRelatedProducts();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar el producto';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{product ? `${product.name} - Bookstore` : 'Producto - Bookstore'}</title>
  <meta name="description" content={product?.description || 'Descubre este producto en nuestra tienda'} />
  {#if product}
    <meta property="og:title" content={product.name} />
    <meta property="og:description" content={product.description || ''} />
    <meta property="og:image" content={product.imageUrl || ''} />
    <meta property="og:type" content="product" />
    <meta name="twitter:card" content="summary_large_image" />
  {/if}
</svelte:head>

<div class="product-detail-container">
  {#if loading}
    <div class="loading">
      <p>Cargando producto...</p>
    </div>
  {:else if error}
    <div class="error">
      <h2>Error</h2>
      <p>{error}</p>
      <a href="/catalogo" class="btn btn-primary">Volver al catálogo</a>
    </div>
  {:else if product}
    <div class="product-detail">
      <!-- Navegación breadcrumb -->
      <nav class="breadcrumb">
        <a href="/">Inicio</a>
        <span>/</span>
        <a href="/catalogo">Catálogo</a>
        <span>/</span>
        {#if product.category}
          <a href="/catalogo?category={product.category}">{product.category}</a>
          <span>/</span>
        {/if}
        <span class="current">{product.name}</span>
      </nav>

      <div class="product-content">
        <!-- Galería de imágenes -->
        <div class="product-gallery">
          <div class="main-image">
            <img
              src={getImageUrls()[currentImageIndex]}
              alt={product.name}
              on:error={(e) => {
                e.target.src = '/placeholder-product.jpg';
              }}
            />
          </div>

          {#if getImageUrls().length > 1}
            <div class="thumbnail-gallery">
              {#each getImageUrls() as imageUrl, index}
                <button
                  class="thumbnail {currentImageIndex === index ? 'active' : ''}"
                  on:click={() => changeImage(index)}
                >
                  <img src={imageUrl} alt={`${product.name} - imagen ${index + 1}`} />
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Información del producto -->
        <div class="product-info">
          <div class="product-header">
            <h1 class="product-title">{product.name}</h1>

            {#if product.sku}
              <p class="product-sku">SKU: {product.sku}</p>
            {/if}
          </div>

          <div class="product-price">
            <span class="price">{formatPrice(product.price)}</span>
          </div>

          {#if product.stock > 0}
            <div class="stock-info in-stock">
              <span class="stock-icon">✓</span>
              <span>{product.stock} unidades disponibles</span>
            </div>
          {:else}
            <div class="stock-info out-of-stock">
              <span class="stock-icon">✗</span>
              <span>Agotado</span>
            </div>
          {/if}

          <div class="product-description">
            <h3>Descripción</h3>
            <p>{product.description || 'Sin descripción disponible.'}</p>
          </div>

          {#if product.category}
            <div class="product-category">
              <h3>Categoría</h3>
              <span class="category-tag">{product.category}</span>
            </div>
          {/if}

          <!-- Selector de cantidad y botón de agregar al carrito -->
          {#if product.stock > 0}
            <div class="add-to-cart-section">
              <div class="quantity-selector">
                <label for="quantity">Cantidad:</label>
                <div class="quantity-controls">
                  <button
                    type="button"
                    class="quantity-btn"
                    disabled={selectedQuantity <= 1}
                    on:click={() => selectedQuantity = Math.max(1, selectedQuantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    bind:value={selectedQuantity}
                    min="1"
                    max={product.stock}
                    class="quantity-input"
                  />
                  <button
                    type="button"
                    class="quantity-btn"
                    disabled={selectedQuantity >= product.stock}
                    on:click={() => selectedQuantity = Math.min(product.stock, selectedQuantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                class="btn btn-primary add-to-cart-btn"
                disabled={addingToCart}
                on:click={addToCart}
              >
                {#if addingToCart}
                  <span class="spinner"></span>
                  Agregando...
                {:else}
                  Agregar al carrito
                {/if}
              </button>
            </div>
          {/if}
        </div>
      </div>

      <!-- Productos relacionados -->
      {#if relatedProducts.length > 0}
        <section class="related-products">
          <h2>Productos relacionados</h2>
          <div class="products-grid">
            {#each relatedProducts as relatedProduct}
              <ProductCard product={relatedProduct} />
            {/each}
          </div>
        </section>
      {/if}

      <!-- Sección de reseñas (placeholder para futuras funcionalidades) -->
      <section class="product-reviews">
        <h2>Reseñas y valoraciones</h2>
        <div class="reviews-placeholder">
          <p>Las reseñas estarán disponibles próximamente.</p>
          <div class="rating-placeholder">
            <div class="stars">
              {#each Array(5) as _, i}
                <span class="star empty">☆</span>
              {/each}
            </div>
            <p>Sin reseñas aún</p>
          </div>
        </div>
      </section>
    </div>
  {:else}
    <div class="error">
      <h2>Producto no encontrado</h2>
      <a href="/catalogo" class="btn btn-primary">Volver al catálogo</a>
    </div>
  {/if}
</div>

<style>
  .product-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .loading, .error {
    text-align: center;
    padding: 4rem 2rem;
  }

  .error h2 {
    color: #e53e3e;
    margin-bottom: 1rem;
  }

  .breadcrumb {
    margin-bottom: 2rem;
    font-size: 0.9rem;
    color: #666;
  }

  .breadcrumb a {
    color: #007bff;
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .breadcrumb span {
    margin: 0 0.5rem;
  }

  .breadcrumb .current {
    color: #333;
  }

  .product-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 4rem;
  }

  .product-gallery {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .main-image img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .thumbnail-gallery {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;
  }

  .thumbnail {
    flex: 0 0 auto;
    width: 80px;
    height: 80px;
    border: 2px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }

  .thumbnail.active {
    border-color: #007bff;
  }

  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .product-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }

  .product-title {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin: 0 0 0.5rem 0;
  }

  .product-sku {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }

  .product-price {
    margin: 1rem 0;
  }

  .price {
    font-size: 2rem;
    font-weight: bold;
    color: #28a745;
  }

  .stock-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  .stock-info.in-stock {
    color: #28a745;
  }

  .stock-info.out-of-stock {
    color: #dc3545;
  }

  .stock-icon {
    font-size: 1.2rem;
  }

  .product-description {
    line-height: 1.6;
  }

  .product-description h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .product-category {
    margin-top: 1rem;
  }

  .product-category h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .category-tag {
    display: inline-block;
    background-color: #f8f9fa;
    color: #333;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
    border: 1px solid #dee2e6;
  }

  .add-to-cart-section {
    margin-top: 2rem;
    padding: 1.5rem 0;
    border-top: 1px solid #eee;
  }

  .quantity-selector {
    margin-bottom: 1.5rem;
  }

  .quantity-selector label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .quantity-btn {
    width: 40px;
    height: 40px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s ease;
  }

  .quantity-btn:hover:not(:disabled) {
    background-color: #f8f9fa;
    border-color: #007bff;
  }

  .quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .quantity-input {
    width: 80px;
    height: 40px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  .add-to-cart-btn {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .related-products {
    margin-top: 4rem;
  }

  .related-products h2 {
    margin-bottom: 2rem;
    color: #333;
    text-align: center;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .product-reviews {
    margin-top: 4rem;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .product-reviews h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .reviews-placeholder {
    text-align: center;
    color: #666;
  }

  .rating-placeholder {
    margin-top: 1rem;
  }

  .stars {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .star {
    font-size: 1.5rem;
    color: #ddd;
  }

  .star.empty {
    color: #ddd;
  }

  @media (max-width: 768px) {
    .product-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .product-title {
      font-size: 1.5rem;
    }

    .price {
      font-size: 1.5rem;
    }

    .main-image img {
      height: 300px;
    }

    .products-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }
</style>
