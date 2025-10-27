<script lang="ts">
  import { listaUtilesStore } from '$lib/stores/listaUtiles';
  import { onMount } from 'svelte';
  import { cartActions } from '$lib/stores/cart';
  import { goto } from '$app/navigation';

  // Accedemos al store con el prefijo $
  const { subscribe } = listaUtilesStore;

  // Estado local para controlar las alternativas visibles
  let showAlternatives: Record<string, boolean> = {};

  // Estado para el modo de edición
  let editingItems: Record<string, boolean> = {};
  let editingQuantities: Record<string, number> = {};
  let editingNames: Record<string, string> = {};

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

  // Función para iniciar edición de cantidad
  const startEditQuantity = (itemId: string, currentQuantity: number) => {
    editingItems[itemId] = true;
    editingQuantities[itemId] = currentQuantity;
    editingItems = editingItems; // Trigger reactivity
  };

  // Función para guardar edición de cantidad
  const saveEditQuantity = (itemId: string) => {
    if (editingQuantities[itemId] > 0) {
      listaUtilesStore.updateItem(itemId, { quantity: editingQuantities[itemId] });
    }
    editingItems[itemId] = false;
    editingItems = editingItems; // Trigger reactivity
  };

  // Función para iniciar edición de nombre
  const startEditName = (itemId: string, currentName: string) => {
    editingItems[itemId] = true;
    editingNames[itemId] = currentName;
    editingItems = editingItems; // Trigger reactivity
  };

  // Función para guardar edición de nombre
  const saveEditName = (itemId: string) => {
    if (editingNames[itemId] && editingNames[itemId].trim()) {
      listaUtilesStore.updateItem(itemId, { name: editingNames[itemId].trim() });
    }
    editingItems[itemId] = false;
    editingItems = editingItems; // Trigger reactivity
  };

  // Función para cancelar edición
  const cancelEdit = (itemId: string) => {
    editingItems[itemId] = false;
    editingItems = editingItems; // Trigger reactivity
  };

  // Función para eliminar un item
  const deleteItem = (itemId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      listaUtilesStore.deleteItem(itemId);
    }
  };

  // Función para agregar un producto manualmente
  const addManualProduct = () => {
    const name = prompt('Nombre del producto:');
    if (name && name.trim()) {
      const quantity = parseInt(prompt('Cantidad:') || '1', 10) || 1;
      const newItem = {
        id: `manual-${Date.now()}`,
        name: name.trim(),
        quantity: quantity,
        unit: 'unid',
        manuallyAdded: true
      };
      listaUtilesStore.updateItem(newItem.id, newItem);
    }
  };

  const addAllToCart = async () => {
    try {
      let successCount = 0;
      let errorCount = 0;

      // Agregar cada producto al carrito
      for (const item of visibleItems) {
        if (item.matchedProduct && item.matchedProduct.inStock) {
          const result = await cartActions.addToCart(item.matchedProduct.id, item.quantity);

          if (result.success) {
            successCount++;
          } else {
            errorCount++;
            console.error(`Error agregando ${item.matchedProduct.name}:`, result.error);
          }
        } else {
          errorCount++;
        }
      }

      if (successCount > 0) {
        // Mostrar mensaje de éxito
        // dispatch('cartUpdated', { successCount, errorCount });

        // Redirigir al carrito después de un breve delay
        setTimeout(() => {
          goto('/carrito');
        }, 1000);
      }

      if (errorCount > 0) {
        alert(`Se agregaron ${successCount} productos al carrito. ${errorCount} productos no pudieron agregarse (sin stock o no disponibles).`);
      } else {
        alert(`¡Perfecto! Se agregaron ${successCount} productos al carrito.`);
      }

    } catch (error) {
      console.error('Error agregando productos al carrito:', error);
      alert('Ocurrió un error al agregar los productos al carrito. Por favor, inténtalo de nuevo.');
    }
  };

  // Variables reactivas
  $: visibleItems = $listaUtilesStore.items.filter(item => !item.deleted);
  $: totalItems = visibleItems.length;
  $: totalPrice = visibleItems.reduce(
    (sum: number, item: any) => sum + (item.matchedProduct?.price || 0) * item.quantity,
    0
  );
  $: hasItems = visibleItems.length > 0;

  // Inicializamos showAlternatives cuando el componente se monta o cuando cambian los items
  $: {
    const allItems = $listaUtilesStore.items;
    if (Object.keys(showAlternatives).length !== allItems.length) {
      showAlternatives = allItems.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = showAlternatives[item.id] || false;
        return acc;
      }, {});
    }
    if (Object.keys(editingItems).length !== allItems.length) {
      editingItems = allItems.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = editingItems[item.id] || false;
        return acc;
      }, {});
    }
  }
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
  <div class="px-4 py-5 sm:px-6 bg-indigo-700 text-white">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold">
          Lista de Útiles Escolar
        </h3>
        <p class="mt-1 text-indigo-100">
          {#if totalItems > 0}
            Hemos encontrado {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu lista
          {:else}
            No se encontraron productos en la lista
          {/if}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          on:click={addManualProduct}
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          + Agregar producto
        </button>
        <div class="bg-white/10 px-4 py-2 rounded-lg">
          <p class="text-sm font-medium">Total estimado</p>
          <p class="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
        </div>
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
    {#if hasItems}
      <ul class="divide-y divide-gray-200">
        {#each visibleItems as item (item.id)}
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
                  {#if editingItems[item.id] && editingNames[item.id] !== undefined}
                    <div class="flex items-center space-x-2">
                      <input
                        type="text"
                        bind:value={editingNames[item.id]}
                        class="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                        on:keydown={(e) => {
                          if (e.key === 'Enter') saveEditName(item.id);
                          if (e.key === 'Escape') cancelEdit(item.id);
                        }}
                      />
                      <div class="flex flex-col space-y-1">
                        <button
                          on:click={() => saveEditName(item.id)}
                          class="text-xs bg-green-500 text-white px-1 py-0.5 rounded hover:bg-green-600"
                          title="Guardar"
                        >
                          ✓
                        </button>
                        <button
                          on:click={() => cancelEdit(item.id)}
                          class="text-xs bg-gray-500 text-white px-1 py-0.5 rounded hover:bg-gray-600"
                          title="Cancelar"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  {:else}
                    <div class="flex items-start justify-between w-full">
                      <div class="flex-1">
                        <div class="flex items-center">
                          <p class="text-sm font-medium text-gray-900">
                            {item.matchedProduct?.name || item.name || 'Producto sin nombre'}
                          </p>
                          {#if !item.matchedProduct}
                            <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Manual
                            </span>
                          {/if}
                        </div>

                        {#if item.matchedProduct}
                          <div class="flex items-center mt-1">
                            <p class="text-sm text-gray-500">
                              {item.matchedProduct.brand || 'Sin marca'} • ${item.matchedProduct.price?.toFixed(2) || '0.00'} c/u
                            </p>
                            {#if item.matchedProduct.inStock !== undefined}
                              {#if item.matchedProduct.inStock}
                                <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  En stock
                                </span>
                              {:else}
                                <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Sin stock
                                </span>
                              {/if}
                            {/if}
                          </div>
                        {:else}
                          <div class="flex items-center mt-1">
                            <p class="text-sm text-yellow-600">
                              No encontrado en el catálogo
                            </p>
                          </div>
                        {/if}
                      </div>
                      <button
                        on:click={() => startEditName(item.id, item.matchedProduct?.name || item.name)}
                        class="text-xs text-blue-600 hover:text-blue-800 ml-2 flex-shrink-0"
                        title="Editar nombre"
                      >
                        ✏️
                      </button>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
            
            <div class="w-24 text-center">
              {#if editingItems[item.id]}
                <div class="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    bind:value={editingQuantities[item.id]}
                    class="w-16 text-sm border border-gray-300 rounded px-2 py-1 text-center"
                    on:keydown={(e) => {
                      if (e.key === 'Enter') saveEditQuantity(item.id);
                      if (e.key === 'Escape') cancelEdit(item.id);
                    }}
                  />
                  <div class="flex flex-col space-y-1">
                    <button
                      on:click={() => saveEditQuantity(item.id)}
                      class="text-xs bg-green-500 text-white px-1 py-0.5 rounded hover:bg-green-600"
                      title="Guardar"
                    >
                      ✓
                    </button>
                    <button
                      on:click={() => cancelEdit(item.id)}
                      class="text-xs bg-gray-500 text-white px-1 py-0.5 rounded hover:bg-gray-600"
                      title="Cancelar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              {:else}
                <div class="flex items-center justify-center space-x-2">
                  <span class="text-sm font-medium">{item.quantity} {item.unit}</span>
                  <div class="flex flex-col space-y-1">
                    <button
                      on:click={() => startEditQuantity(item.id, item.quantity)}
                      class="text-xs text-blue-600 hover:text-blue-800"
                      title="Editar cantidad"
                    >
                      ✏️
                    </button>
                    <button
                      on:click={() => deleteItem(item.id)}
                      class="text-xs text-red-600 hover:text-red-800"
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              {/if}
            </div>
            
            <div class="w-32 text-right">
              {#if item.matchedProduct}
                <p class="text-sm font-medium">${((item.matchedProduct.price || 0) * item.quantity).toFixed(2)}</p>
                <p class="text-xs text-gray-500">${item.matchedProduct.price?.toFixed(2) || '0.00'} c/u</p>
              {:else}
                <p class="text-sm text-gray-400">-</p>
                <p class="text-xs text-gray-400">No disponible</p>
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
    {:else}
      <div class="text-center py-8 px-4">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay productos en la lista</h3>
        <p class="text-gray-500 mb-4">Agrega productos manualmente o sube una nueva lista de útiles.</p>
        <button
          on:click={addManualProduct}
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Agregar producto manualmente
        </button>
      </div>
    {/if}
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
