<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  
  // Get the list ID from the URL
  export let data;
  const { list } = data;
  
  // Format date helper
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  }
  
  // Calculate total items
  $: totalItems = list?.items?.length || 0;
  
  // Filter items by status
  $: pendingItems = list?.items?.filter(item => item.status === 'PENDING') || [];
  $: foundItems = list?.items?.filter(item => item.status === 'FOUND') || [];
  $: notFoundItems = list?.items?.filter(item => item.status === 'NOT_FOUND') || [];
  $: substitutedItems = list?.items?.filter(item => item.status === 'SUBSTITUTED') || [];
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{list.name}</h1>
        <p class="text-gray-600">
          {list.institution.name} - {list.grade}
        </p>
        {list.notes && (
          <p class="mt-2 text-gray-600">
            <span class="font-medium">Notas:</span> {list.notes}
          </p>
        )}
      </div>
      <div class="mt-4 md:mt-0 text-sm text-gray-500">
        <div>Creada el {formatDate(list.createdAt)}</div>
        {list.updatedAt !== list.createdAt && (
          <div>Actualizada el {formatDate(list.updatedAt)}</div>
        )}
        <div class="mt-1 text-blue-600">
          {list.status === 'DRAFT' && 'Borrador'}
          {list.status === 'PUBLISHED' && 'Publicada'}
          {list.status === 'ARCHIVED' && 'Archivada'}
        </div>
      </div>
    </div>
    
    <!-- Status Summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div class="text-2xl font-bold text-blue-700">{totalItems}</div>
        <div class="text-sm text-blue-600">Total de artículos</div>
      </div>
      <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <div class="text-2xl font-bold text-yellow-700">{pendingItems.length}</div>
        <div class="text-sm text-yellow-600">Pendientes</div>
      </div>
      <div class="bg-green-50 p-4 rounded-lg border border-green-100">
        <div class="text-2xl font-bold text-green-700">{foundItems.length + substitutedItems.length}</div>
        <div class="text-sm text-green-600">Encontrados</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg border border-red-100">
        <div class="text-2xl font-bold text-red-700">{notFoundItems.length}</div>
        <div class="text-sm text-red-600">No encontrados</div>
      </div>
    </div>
    
    <!-- Items List -->
    <div class="space-y-6">
      {#if pendingItems.length > 0}
        <div class="border rounded-lg overflow-hidden">
          <div class="bg-gray-50 px-4 py-2 border-b font-medium text-gray-700">
            Pendientes ({pendingItems.length})
          </div>
          <ul class="divide-y divide-gray-200">
            {#each pendingItems as item (item.id)}
              <li class="px-4 py-3 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <div class="font-medium">{item.name}</div>
                  {item.notes && (
                    <div class="text-sm text-gray-500">{item.notes}</div>
                  )}
                </div>
                <div class="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      
      {#if foundItems.length > 0}
        <div class="border rounded-lg overflow-hidden">
          <div class="bg-green-50 px-4 py-2 border-b font-medium text-green-700">
            Encontrados ({foundItems.length})
          </div>
          <ul class="divide-y divide-gray-200">
            {#each foundItems as item (item.id)}
              <li class="px-4 py-3 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <div class="font-medium">{item.name}</div>
                  {item.notes && (
                    <div class="text-sm text-gray-500">{item.notes}</div>
                  )}
                </div>
                <div class="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      
      {#if substitutedItems.length > 0}
        <div class="border rounded-lg overflow-hidden">
          <div class="bg-yellow-50 px-4 py-2 border-b font-medium text-yellow-700">
            Reemplazados ({substitutedItems.length})
          </div>
          <ul class="divide-y divide-gray-200">
            {#each substitutedItems as item (item.id)}
              <li class="px-4 py-3 hover:bg-gray-50">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium">{item.name}</div>
                    <div class="text-sm text-yellow-600">Reemplazo para: {item.originalName}</div>
                    {item.notes && (
                      <div class="text-sm text-gray-500 mt-1">{item.notes}</div>
                    )}
                  </div>
                  <div class="text-sm text-gray-500 ml-4 whitespace-nowrap">
                    Cantidad: {item.quantity}
                  </div>
                </div>
                {item.product && (
                  <div class="mt-2 text-sm">
                    <a 
                      href="/productos/{item.product.id}" 
                      class="text-blue-600 hover:underline"
                    >
                      Ver producto
                    </a>
                  </div>
                )}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      
      {#if notFoundItems.length > 0}
        <div class="border rounded-lg overflow-hidden">
          <div class="bg-red-50 px-4 py-2 border-b font-medium text-red-700">
            No encontrados ({notFoundItems.length})
          </div>
          <ul class="divide-y divide-gray-200">
            {#each notFoundItems as item (item.id)}
              <li class="px-4 py-3 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <div class="font-medium">{item.name}</div>
                  {item.notes && (
                    <div class="text-sm text-gray-500">{item.notes}</div>
                  )}
                </div>
                <div class="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Actions -->
  <div class="flex justify-end space-x-4">
    <a 
      href="/lista-utiles/editar/{list.id}" 
      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      Editar lista
    </a>
    <a 
      href="/lista-utiles/crear" 
      class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      Crear nueva lista
    </a>
  </div>
</div>
