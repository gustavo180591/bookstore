<script lang="ts">
  import type { Product } from '$lib/api/products';

  interface Props {
    product: Product;
  }

  let { product }: Props = $props();

  function formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(numPrice);
  }

  function handleAddToCart() {
    // TODO: Implementar agregar al carrito
    console.log('Agregar al carrito:', product.id);
    // Por ahora solo mostrar un mensaje
    alert(`¡${product.name} agregado al carrito!`);
  }
</script>

<div class="product-card border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
      disabled={product.stock === 0}
      onclick={handleAddToCart}
    >
      {#if product.stock === 0}
        No disponible
      {:else}
        Agregar al carrito
      {/if}
    </button>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
