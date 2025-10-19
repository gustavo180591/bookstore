<script lang="ts">
  import { listaUtilesStore } from '$lib/stores/listaUtiles';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let showAlternatives: Record<string, boolean> = {};
  
  const toggleAlternatives = (itemId: string) => {
    showAlternatives[itemId] = !showAlternatives[itemId];
    showAlternatives = showAlternatives; // Trigger reactivity
  };
  
  const selectAlternative = (itemId: string, product: any) => {
    listaUtilesStore.updateItem(itemId, { matchedProduct: product });
    toggleAlternatives(itemId);
  };
  
  const addAllToCart = async () => {
    // In a real app, this would add all items to the cart
    // For now, we'll just redirect to the cart
    goto('/carrito');
  };
  
  $: totalItems = $listaUtilesStore.items.length;
  $: totalPrice = $listaUtilesStore.items.reduce(
    (sum, item) => sum + (item.matchedProduct?.price || 0) * item.quantity,
    0
  );
  
  // Initialize showAlternatives
  onMount(() => {
    showAlternatives = $listaUtilesStore.items.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {});
  });
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
  <div class="px-4 py-5 sm:px-6 bg-gray-50">
    <h3 class="text-lg leading-6 font-medium text-gray-900">
      Lista de útiles escaneada
    </h3>
    <p class="mt-1 max-w-2xl text-sm text-gray-500">
      Revisa los productos reconocidos y sus alternativas
    </p>
  </div>
  
  <div class="border-t border-gray-200">
    <ul class="divide-y divide-gray-200">
      {#each $listaUtilesStore.items as item (item.id)}
        <li class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-indigo-600 truncate">
                {item.name}
                <span class="text-gray-500 ml-2">
                  ({item.quantity} {item.unit})
                </span>
              </p>
              
              {#if item.matchedProduct}
                <div class="mt-1 flex items-center text-sm text-gray-500">
                  <span class="truncate">
                    {item.matchedProduct.brand} • ${item.matchedProduct.price.toFixed(2)} c/u
                  </span>
                  {#if !item.matchedProduct.inStock}
                    <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Sin stock
                    </span>
                  {/if}
                </div>
                
                <p class="mt-1 text-sm text-gray-500">
                  Total: <span class="font-medium">${(item.matchedProduct.price * item.quantity).toFixed(2)}</span>
                </p>
              {:else}
                <p class="mt-1 text-sm text-yellow-600">
                  No encontrado en el catálogo
                </p>
              {/if}
            </div>
            
            <div class="ml-4 flex-shrink-0">
              <button
                type="button"
                on:click={() => toggleAlternatives(item.id)}
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showAlternatives[item.id] ? 'Ocultar' : 'Ver'} alternativas
              </button>
            </div>
          </div>
          
          {#if showAlternatives[item.id] && item.alternatives?.length}
            <div class="mt-4 border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Alternativas disponibles:</h4>
              <ul class="space-y-3">
                {#each item.alternatives as product}
                  <li class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{product.name}</p>
                      <p class="text-sm text-gray-500">{product.brand} • ${product.price.toFixed(2)} c/u</p>
                    </div>
                    <button
                      type="button"
                      on:click={() => selectAlternative(item.id, product)}
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
  
  <div class="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center">
    <div>
      <p class="text-sm text-gray-500">
        <span class="font-medium text-gray-900">{totalItems}</span> productos en la lista
      </p>
      <p class="text-lg font-medium text-gray-900">
        Total estimado: <span class="text-indigo-600">${totalPrice.toFixed(2)}</span>
      </p>
    </div>
    
    <button
      type="button"
      on:click={addAllToCart}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Agregar todo al carrito
    </button>
  </div>
</div>
