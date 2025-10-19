<script lang="ts">
  import { cartActions } from '$lib/stores/cart';
  import type { Product } from '$lib/api/products';

  interface Props {
    product: Product;
  }

  let { product }: Props = $props();

  let addingToCart = $state(false);

  function formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(numPrice);
  }

  async function handleAddToCart() {
    if (product.stock === 0) {
      alert('Este producto está agotado');
      return;
    }

    // Verificar si el usuario está autenticado
    try {
      // Hacer una petición a la API para verificar autenticación
      const response = await fetch('/api/cart');
      const data = await response.json();

      if (response.status === 401) {
        // Usuario no autenticado, redirigir al login
        alert('Debes iniciar sesión para agregar productos al carrito');
        window.location.href = '/auth/login';
        return;
      }

      if (!data.success) {
        alert(`Error: ${data.error}`);
        return;
      }

      // Usuario autenticado, proceder con agregar al carrito
      addingToCart = true;

      const result = await cartActions.addToCart(product.id, 1);

      if (result.success) {
        alert(result.message || `${product.name} agregado al carrito`);
      } else if (result.needsAuth) {
        // Usuario no autenticado, redirigir al login
        alert(result.error || 'Debes iniciar sesión para agregar productos al carrito');
        window.location.href = '/auth/login';
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      alert('Error interno del servidor');
    } finally {
      addingToCart = false;
    }
  }
</script>

<a href="/producto/{product.id}" class="product-link">
  <!-- Imagen del producto -->
  <div class="aspect-w-1 aspect-h-1 bg-gray-200">
    {#if product.imageUrl}
      <img
        src={product.imageUrl}
        alt={product.name}
        class="w-full h-48 object-cover"
      />
    {:else}
      <div class="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <span class="text-4xl">📚</span>
      </div>
    {/if}
  </div>

  <!-- Información del producto -->
  <div class="p-4">
    <div class="mb-2">
      {#if product.category}
        <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mb-2">
          {product.category}
        </span>
      {/if}
    </div>

    <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
      {product.name}
    </h3>

    {#if product.description}
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {product.description}
      </p>
    {/if}

    <!-- Precio y stock -->
    <div class="flex justify-between items-center mb-3">
      <span class="text-xl font-bold text-green-600">
        {formatPrice(product.price)}
      </span>

      {#if product.stock > 0}
        <span class="text-sm text-gray-500">
          Stock: {product.stock}
        </span>
      {:else}
        <span class="text-sm text-red-500 font-medium">
          Agotado
        </span>
      {/if}
    </div>

    <!-- SKU (opcional) -->
    {#if product.sku}
      <p class="text-xs text-gray-400 mb-3">
        SKU: {product.sku}
      </p>
    {/if}

    <!-- Botón de acción -->
    <button
      class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 disabled:cursor-not-allowed"
      disabled={product.stock === 0 || addingToCart}
      onclick={handleAddToCart}
    >
      {#if addingToCart}
        <div class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        Agregando...
      {:else if product.stock === 0}
        No disponible
      {:else}
        Agregar al carrito
      {/if}
    </button>
  </div>
</a>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-link {
    display: block;
    text-decoration: none;
    color: inherit;
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

  .aspect-w-1 {
    aspect-ratio: 1;
    background-color: #f3f4f6;
  }

  .product-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-card .bg-gradient-to-br {
    background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  }

  .product-card .flex {
    display: flex;
  }

  .product-card .items-center {
    align-items: center;
  }

  .product-card .justify-center {
    justify-content: center;
  }

  .product-card .text-4xl {
    font-size: 2.5rem;
  }

  .product-card .p-4 {
    padding: 1rem;
  }

  .product-card .mb-2 {
    margin-bottom: 0.5rem;
  }

  .product-card .text-xs {
    font-size: 0.75rem;
  }

  .product-card .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .product-card .py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  .product-card .rounded-full {
    border-radius: 9999px;
  }

  .product-card .font-medium {
    font-weight: 500;
  }

  .product-card .text-lg {
    font-size: 1.125rem;
  }

  .product-card .font-semibold {
    font-weight: 600;
  }

  .product-card .text-gray-900 {
    color: #111827;
  }

  .product-card .mb-2 {
    margin-bottom: 0.5rem;
  }

  .product-card .text-gray-600 {
    color: #4b5563;
  }

  .product-card .text-sm {
    font-size: 0.875rem;
  }

  .product-card .mb-3 {
    margin-bottom: 0.75rem;
  }

  .product-card .flex {
    display: flex;
  }

  .product-card .justify-between {
    justify-content: space-between;
  }

  .product-card .items-center {
    align-items: center;
  }

  .product-card .mb-3 {
    margin-bottom: 0.75rem;
  }

  .product-card .text-xl {
    font-size: 1.25rem;
  }

  .product-card .font-bold {
    font-weight: 700;
  }

  .product-card .text-green-600 {
    color: #059669;
  }

  .product-card .text-gray-500 {
    color: #6b7280;
  }

  .product-card .text-red-500 {
    color: #dc2626;
  }

  .product-card .text-gray-400 {
    color: #9ca3af;
  }

  .product-card .mb-3 {
    margin-bottom: 0.75rem;
  }

  .product-card .w-full {
    width: 100%;
  }

  .product-card .bg-blue-600 {
    background-color: #2563eb;
  }

  .product-card .hover\:bg-blue-700:hover {
    background-color: #1d4ed8;
  }

  .product-card .disabled\:bg-gray-300:disabled {
    background-color: #d1d5db;
  }

  .product-card .text-white {
    color: white;
  }

  .product-card .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .product-card .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .product-card .rounded-md {
    border-radius: 0.375rem;
  }

  .product-card .font-medium {
    font-weight: 500;
  }

  .product-card .transition-colors {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }

  .product-card .duration-200 {
    transition-duration: 200ms;
  }

  .product-card .disabled\:cursor-not-allowed:disabled {
    cursor: not-allowed;
  }

  .product-card .inline-block {
    display: inline-block;
  }

  .product-card .w-4 {
    width: 1rem;
  }

  .product-card .h-4 {
    height: 1rem;
  }

  .product-card .border-2 {
    border-width: 2px;
  }

  .product-card .border-white {
    border-color: white;
  }

  .product-card .border-t-transparent {
    border-top-color: transparent;
  }

  .product-card .rounded-full {
    border-radius: 9999px;
  }

  .product-card .animate-spin {
    animation: spin 1s linear infinite;
  }

  .product-card .mr-2 {
    margin-right: 0.5rem;
  }
</style>
