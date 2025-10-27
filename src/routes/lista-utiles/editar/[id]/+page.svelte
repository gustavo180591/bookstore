<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  // Get the list data from the server
  export let data;
  let { list } = data;
  
  // Form state
  let listName = list.name;
  let grade = list.grade;
  let institutionId = list.institutionId;
  let notes = list.notes || '';
  let items = list.items.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    notes: item.notes || '',
    status: item.status,
  }));
  
  let institutions = [];
  let isLoading = false;
  let isSaving = false;
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
      alert('Error al cargar las instituciones');
    } finally {
      isLoading = false;
    }
  });

  // Add new item row
  function addItem() {
    items = [...items, { id: `new-${Date.now()}`, name: '', quantity: 1, notes: '', status: 'PENDING' }];
  }

  // Remove item row
  function removeItem(index: number) {
    items = items.filter((_, i) => i !== index);
  }

  // Update item field
  function updateItem(index: number, field: string, value: any) {
    items = items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
  }

  // Handle form submission
  async function handleSubmit() {
    if (!listName || !grade || !institutionId) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    // Filter out empty items
    const validItems = items.filter(item => item.name.trim() !== '');
    
    if (validItems.length === 0) {
      alert('La lista debe contener al menos un artículo');
      return;
    }

    try {
      isSaving = true;
      const response = await fetch(`/api/school-lists/${list.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: listName,
          grade,
          institutionId,
          notes: notes || null,
          items: validItems.map(item => ({
            id: item.id.startsWith('new-') ? undefined : item.id,
            name: item.name,
            quantity: item.quantity,
            notes: item.notes || null,
            status: item.status,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Lista actualizada exitosamente');
        goto(`/lista-utiles/${data.id}`);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar la lista');
      }
    } catch (error) {
      console.error('Error updating list:', error);
      alert(`Error: ${error.message}`);
    } finally {
      isSaving = false;
    }
  }

  // Handle delete
  async function handleDelete() {
    if (!confirm('¿Está seguro que desea eliminar esta lista? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/school-lists/${list.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Lista eliminada exitosamente');
        goto('/lista-utiles');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar la lista');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      alert(`Error: ${error.message}`);
    }
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Editar Lista de Útiles</h1>
    
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Ej: Lista 1er Grado 2024"
          />
        </div>
        
        <!-- Institution -->
        <div>
          <label for="institution" class="block text-sm font-medium text-gray-700 mb-1">
            Institución <span class="text-red-500">*</span>
          </label>
          <select
            id="institution"
            bind:value={institutionId}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          >
            <option value="">Seleccione una institución</option>
            {#each institutions as inst}
              <option value={inst.id}>
                {inst.name} - {inst.city}
              </option>
            {/each}
          </select>
        </div>
        
        <!-- Grade -->
        <div>
          <label for="grade" class="block text-sm font-medium text-gray-700 mb-1">
            Grado/Año <span class="text-red-500">*</span>
          </label>
          <select
            id="grade"
            bind:value={grade}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccione un grado/año</option>
            {#each grades as g}
              <option value={g}>{g}</option>
            {/each}
          </select>
        </div>
        
        <!-- Notes -->
        <div class="col-span-2">
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales (opcional)
          </label>
          <textarea
            id="notes"
            bind:value={notes}
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Agregue notas adicionales sobre esta lista..."
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
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Agregar artículo
          </button>
        </div>
        
        <div class="space-y-4">
          {#each items as item, i (item.id)}
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200" transition:fade>
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <!-- Item Name -->
                <div class="md:col-span-5">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del artículo <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    bind:value={item.name}
                    on:change={(e) => updateItem(i, 'name', e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Cuaderno tapa dura 48 hojas"
                    required
                  />
                </div>
                
                <!-- Quantity -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    bind:value={item.quantity}
                    on:change={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <!-- Status -->
                <div class="md:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    bind:value={item.status}
                    on:change={(e) => updateItem(i, 'status', e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="FOUND">Encontrado</option>
                    <option value="NOT_FOUND">No encontrado</option>
                    <option value="SUBSTITUTED">Reemplazado</option>
                  </select>
                </div>
                
                <!-- Remove Button -->
                <div class="md:col-span-2 flex items-end">
                  <button
                    type="button"
                    on:click={() => removeItem(i)}
                    class="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <!-- Notes -->
                <div class="md:col-span-12">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Notas (opcional)
                  </label>
                  <input
                    type="text"
                    bind:value={item.notes}
                    on:change={(e) => updateItem(i, 'notes', e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Marca específica, color, etc."
                  />
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Form Actions -->
      <div class="pt-6 border-t border-gray-200 flex justify-between">
        <div>
          <button
            type="button"
            on:click={handleDelete}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar lista
          </button>
        </div>
        <div class="space-x-3">
          <a
            href="/lista-utiles/{list.id}"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </a>
          <button
            type="submit"
            disabled={isSaving}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
