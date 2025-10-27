<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { cart } from '$lib/stores/cart';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  
  // Types
  interface Institution {
    id: string;
    name: string;
    city?: string;
  }
  
  interface ListItem {
    name: string;
    quantity: number;
    notes: string;
  }

  // Form state
  let listName = '';
  let grade = '';
  let institution = '';
  let notes = '';
  let items = [{ name: '', quantity: 1, notes: '' }];
  let isLoading = false;
  let isSaving = false;
  let institutions: Institution[] = [];
  let grades = [
    'Sala de 3', 'Sala de 4', 'Sala de 5',
    '1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado',
    '1er Año', '2do Año', '3er Año', '4to Año', '5to Año', '6to Año'
  ];

  // Load institutions on mount
  onMount(async () => {
    try {
      isLoading = true;
      const response = await fetch('/api/institutions');
      if (response.ok) {
        institutions = await response.json();
      }
    } catch (error) {
      console.error('Error loading institutions:', error);
      // Using browser alert as fallback
      if (error instanceof Error) {
        alert('Error al cargar las instituciones: ' + error.message);
      } else {
        alert('Error al cargar las instituciones');
      }
    } finally {
      isLoading = false;
    }
  });

  // Add new item row
  function addItem() {
    items = [...items, { name: '', quantity: 1, notes: '' }];
  }

  // Remove item row
  function removeItem(index: number) {
    items = items.filter((_, i) => i !== index);
  }

  // Handle form submission
  async function handleSubmit() {
    if (!listName || !grade || !institution) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    try {
      isSaving = true;
      const response = await fetch('/api/school-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: listName,
          grade,
          institutionId: institution,
          notes,
          items: items.filter(item => item.name.trim() !== '')
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Lista guardada exitosamente');
        goto(`/lista-utiles/${data.id}`);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al guardar la lista');
      }
    } catch (error) {
      console.error('Error saving list:', error);
      if (error instanceof Error) {
        alert('Error: ' + error.message);
      } else {
        alert('Error al guardar la lista');
      }
    } finally {
      isSaving = false;
    }
  }

  // Add all items to cart
  function addAllToCart() {
    const validItems = items.filter(item => item.name.trim() !== '');
    if (validItems.length === 0) {
      alert('No hay ítems para agregar al carrito');
      return;
    }
    
    // This is a simplified version - in a real app, you would need to match items with products
    alert(`${validItems.length} ítems agregados al carrito`);
    // Here you would typically dispatch an action to add items to the cart
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Crear Lista de Útiles</h1>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- List Name -->
        <div class="col-span-2">
          <label for="listName" class="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la lista <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="listName"
            bind:value={listName}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ej: Lista 3er Grado 2025"
            required
          />
        </div>

        <!-- Grade -->
        <div>
          <label for="grade" class="block text-sm font-medium text-gray-700 mb-1">
            Grado/Año <span class="text-red-500">*</span>
          </label>
          <select
            id="grade"
            bind:value={grade}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" disabled selected>Seleccione un grado</option>
            {#each grades as g}
              <option value={g}>{g}</option>
            {/each}
          </select>
        </div>

        <!-- Institution -->
        <div>
          <label for="institution" class="block text-sm font-medium text-gray-700 mb-1">
            Institución <span class="text-red-500">*</span>
          </label>
          <select
            id="institution"
            bind:value={institution}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={isLoading}
          >
            <option value="" disabled selected>
              {isLoading ? 'Cargando...' : 'Seleccione una institución'}
            </option>
            {#each institutions as inst}
              <option value={inst.id}>
                {inst.name} {inst.city ? `(${inst.city})` : ''}
              </option>
            {/each}
          </select>
        </div>

        <!-- Notes -->
        <div class="col-span-2">
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales
          </label>
          <textarea
            id="notes"
            bind:value={notes}
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Instrucciones especiales o comentarios"
          ></textarea>
        </div>
      </div>

      <!-- Items List -->
      <div class="mt-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Artículos</h2>
          <button
            type="button"
            on:click={addItem}
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar ítem
          </button>
        </div>

        <div class="space-y-4">
          {#each items as item, i (i)}
            <div transition:fade class="grid grid-cols-12 gap-3 items-start">
              <div class="col-span-6">
                <input
                  type="text"
                  bind:value={item.name}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nombre del artículo"
                />
              </div>
              <div class="col-span-2">
                <input
                  type="number"
                  min="1"
                  bind:value={item.quantity}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div class="col-span-3">
                <input
                  type="text"
                  bind:value={item.notes}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Especificaciones"
                />
              </div>
              <div class="col-span-1 flex justify-end">
                {#if items.length > 1}
                  <button
                    type="button"
                    on:click={() => removeItem(i)}
                    class="text-red-500 hover:text-red-700 focus:outline-none"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          on:click={addAllToCart}
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSaving || items.every(item => !item.name.trim())}
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Agregar todo al carrito
        </button>
        <button
          type="submit"
          class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar lista'}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  /* Add some transitions for better UX */
  input, select, textarea {
    transition: all 0.2s ease-in-out;
  }
  
  /* Custom scrollbar for better UX */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
