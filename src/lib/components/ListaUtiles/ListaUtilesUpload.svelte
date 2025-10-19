<script lang="ts">
  import { listaUtilesStore, processListaUtiles } from '$lib/stores/listaUtiles';
  import { onDestroy } from 'svelte';
  
  let fileInput: HTMLInputElement;
  let isDragging = false;
  
  // Reset the store to initial state to clear any errors
  const resetErrorState = () => {
    if ($listaUtilesStore.status === 'error') {
      listaUtilesStore.clear();
    }
  };
  
  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      resetErrorState();
      
      try {
        // Process the file
        await processListaUtiles(file);
        
        // If processing was successful, the store will be updated with the results
      } catch (error) {
        console.error('Error processing file:', error);
      } finally {
        // Reset the input to allow selecting the same file again
        if (target) target.value = '';
      }
    }
  };
  
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging = false;
    
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      resetErrorState();
      processListaUtiles(file).catch(error => {
        console.error('Error processing dropped file:', error);
      });
    }
  };
  
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    isDragging = true;
  };
  
  const handleDragLeave = () => {
    isDragging = false;
  };
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerFileInput();
    }
  };
  
  const triggerFileInput = () => {
    fileInput?.click();
  };
  
  // Clean up when component is destroyed
  onDestroy(() => {
    resetErrorState();
  });
</script>

<div class="max-w-3xl mx-auto">
  <div 
    class={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
      isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
    }`}
    on:click={triggerFileInput}
    on:keydown={handleKeyDown}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    role="button"
    tabindex="0"
    aria-label="Arrastra y suelta un archivo o haz clic para seleccionar"
  >
    <div class="space-y-4">
      {#if $listaUtilesStore.status === 'processing' || $listaUtilesStore.status === 'uploading'}
        <div class="flex flex-col items-center justify-center py-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-sm text-gray-600">Procesando tu lista de útiles...</p>
        </div>
      {:else}
        <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div class="space-y-1">
          <p class="text-lg font-medium text-gray-900">
            Arrastra tu lista de útiles aquí o haz clic para seleccionar
          </p>
          <p class="text-sm text-gray-500">
            Formatos soportados: JPG, PNG, PDF (máx. 10MB)
          </p>
        </div>
        
        <div>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Seleccionar archivo
          </button>
        </div>
      {/if}
    </div>
    
    <input
      type="file"
      bind:this={fileInput}
      class="hidden"
      accept="image/*,.pdf"
      on:change={handleFileChange}
    />
  </div>
  
  <div class="mt-4">
    <p class="text-sm text-gray-500 text-center">
      ¿No tienes una lista digital? <a href="/soporte" class="text-blue-600 hover:text-blue-800">Contáctanos</a> y te ayudamos
    </p>
  </div>
</div>
