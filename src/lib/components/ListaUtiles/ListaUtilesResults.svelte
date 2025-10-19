<script lang="ts">
  import { listaUtilesStore } from '$lib/stores/listaUtiles';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  // Accedemos al store con el prefijo $
  const { subscribe } = listaUtilesStore;
  
  // Estado local para controlar las alternativas visibles
  let showAlternatives: Record<string, boolean> = {};
  
  // Función para alternar la visibilidad de alternativas
  const toggleAlternatives = (itemId: string) => {
    showAlternatives[itemId] = !showAlternatives[itemId];
    showAlternatives = showAlternatives; // Trigger reactivity
  };
  
  // Función para seleccionar una alternativa
  const selectAlternative = (itemId: string, product: any) => {
    listaUtilesStore.updateItem(itemId, { matchedProduct: product });
    toggleAlternatives(itemId);
  };
  
  // Función para agregar todos los items al carrito
  const addAllToCart = async () => {
    // En una aplicación real, aquí se agregarían los items al carrito
    // Por ahora, solo redirigimos al carrito
    goto('/carrito');
  };
  
  // Variables reactivas
  $: totalItems = $listaUtilesStore.items.length;
  $: totalPrice = $listaUtilesStore.items.reduce(
    (sum: number, item: any) => sum + (item.matchedProduct?.price || 0) * item.quantity,
    0
  );
  
  // Inicializamos showAlternatives cuando el componente se monta
  onMount(() => {
    showAlternatives = $listaUtilesStore.items.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {});
  });
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
  <div class="px-4 py-5 sm:px-6 bg-indigo-700 text-white">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold">
          Lista de Útiles Escolar
        </h3>
        <p class="mt-1 text-indigo-100">
          Hemos encontrado {$listaUtilesStore.items.length} { $listaUtilesStore.items.length === 1 ? 'producto' : 'productos'} en tu lista
        </p>
      </div>
      <div class="bg-white/10 px-4 py-2 rounded-lg">
        <p class="text-sm font-medium">Total estimado</p>
        <p class="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  </div>
  
  <div class="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
    <div class="flex-1">
      <span class="text-sm font-medium text-gray-500">Producto</span>
    </div>
    <div class="w-24 text-center">
      <span class="text-sm font-medium text-gray-500">Cantidad</span>
    </div>
    <div class="w-32 text-right">
      <span class="text-sm font-medium text-gray-500">Precio</span>
    </div>
  </div>
  
  <div class="divide-y divide-gray-200">
    <ul class="divide-y divide-gray-200">
      {#each $listaUtilesStore.items as item (item.id)}
        <li class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                {#if item.matchedProduct?.image}
                  <div class="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4">
                    <img 
                      src={item.matchedProduct.image} 
                      alt={item.matchedProduct.name}
                      class="h-full w-full object-cover"
                    />
                  </div>
                {:else}
                  <div class="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4 flex items-center justify-center">
                    <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                {/if}
                
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {#if item.matchedProduct}
                      {item.matchedProduct.name}
                    {:else}
                      {item.name}
                    {/if}
                  </p>
                  
                  {#if item.matchedProduct}
                    <div class="flex items-center">
                      <p class="text-sm text-gray-500">
                        {item.matchedProduct.brand} • ${item.matchedProduct.price.toFixed(2)} c/u
                      </p>
                      {#if !item.matchedProduct.inStock}
                        <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Sin stock
                        </span>
                      {:else}
                        <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          En stock
                        </span>
                      {/if}
                    </div>
                  {:else}
                    <div class="flex items-center">
                      <p class="text-sm text-yellow-600">
                        No encontrado en el catálogo
                      </p>
                      <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Búsqueda manual
                      </span>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
            
            <div class="w-24 text-center">
              <span class="text-sm font-medium">{item.quantity} {item.unit}</span>
            </div>
            
            <div class="w-32 text-right">
              {#if item.matchedProduct}
                <p class="text-sm font-medium">${(item.matchedProduct.price * item.quantity).toFixed(2)}</p>
                <p class="text-xs text-gray-500">${item.matchedProduct.price.toFixed(2)} c/u</p>
              {:else}
                <p class="text-sm text-gray-400">-</p>
              {/if}
            </div>
            
            <div class="ml-4 flex-shrink-0">
              <button
                type="button"
                on:click={() => toggleAlternatives(item.id)}
                class="inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="{showAlternatives[item.id] ? 'Ocultar' : 'Mostrar'} alternativas"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {#if showAlternatives[item.id] && item.alternatives?.length}
            <div class="mt-4 pt-4 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Alternativas disponibles:</h4>
              <ul class="space-y-3">
                {#each item.alternatives as product}
                  <li class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div class="flex items-center">
                      {#if product.image}
                        <div class="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-white mr-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            class="h-full w-full object-cover"
                          />
                        </div>
                      {/if}
                      <div>
                        <p class="text-sm font-medium text-gray-900">{product.name}</p>
                        <p class="text-sm text-gray-500">{product.brand} • ${product.price.toFixed(2)} c/u</p>
                        {#if !product.inStock}
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                            Bajo stock
                          </span>
                        {/if}
                      </div>
                    </div>
                    <button
                      type="button"
                      on:click={() => selectAlternative(item.id, product)}
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Seleccionar
                    </button>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
  
  <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
    <div>
      <p class="text-sm text-gray-500">
        {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en total
      </p>
      <p class="text-sm text-gray-900 font-medium">
        Total estimado: <span class="text-lg">${totalPrice.toFixed(2)}</span>
      </p>
    </div>
    <div class="flex space-x-3">
      <button
        type="button"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Guardar lista
      </button>
      <button
        type="button"
        on:click={addAllToCart}
        class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Agregar todo al carrito
      </button>
    </div>
  </div>
</div>
