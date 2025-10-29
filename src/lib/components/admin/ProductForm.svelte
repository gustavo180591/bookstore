<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  
  type Product = {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    sku?: string;
    isActive?: boolean;
  };
  
  type Category = {
    name: string;
    productCount?: number;
  };
  
  export let product: Product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: ''
  };
  
  export let categories: Category[] = [];
  export let loading = false;
  
  const dispatch = createEventDispatcher();
  
  let imageFile: File | null = null;
  let previewUrl = product.imageUrl || '';
  
  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor, sube un archivo de imagen válido');
      return;
    }
    
    imageFile = file;
    previewUrl = URL.createObjectURL(file);
  }
  
  function handleSubmit() {
    const formData = new FormData();
    
    // Add product data
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    formData.append('category', product.category);
    
    // Add current image URL if exists (for updates)
    if (product.imageUrl) {
      formData.append('currentImage', product.imageUrl);
    }
    
    // Add image if uploaded
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Add isActive status (default to true for new products)
    formData.append('isActive', (product.isActive ?? true).toString());
    
    // Add SKU if exists
    if (product.sku) {
      formData.append('sku', product.sku);
    }
    
    dispatch('submit', formData);
  }
  
  $: isFormValid = product.name && product.price >= 0 && product.stock >= 0;
</script>

<div class="space-y-6">
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <!-- Columna izquierda: Información básica -->
    <div class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Nombre del producto <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          bind:value={product.name}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Ej: Cuaderno Universitario"
          required
        />
      </div>
      
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          bind:value={product.description}
          rows="4"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe el producto..."
        ></textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700">
            Precio <span class="text-red-500">*</span>
          </label>
          <div class="relative mt-1 rounded-md shadow-sm">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              bind:value={product.price}
              min="0"
              step="0.01"
              class="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="0.00"
              required
            />
          </div>
        </div>
        
        <div>
          <label for="stock" class="block text-sm font-medium text-gray-700">
            Stock <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            bind:value={product.stock}
            min="0"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>
      
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">
          Categoría <span class="text-red-500">*</span>
        </label>
        <select
          id="category"
          bind:value={product.category}
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Selecciona una categoría</option>
          {#each categories as category}
            <option value={category.name}>{category.name} {category.productCount ? `(${category.productCount})` : ''}</option>
          {/each}
        </select>
      </div>
    </div>
    
    <!-- Columna derecha: Imagen del producto -->
    <div class="space-y-6">
      <div>
        <label for="file-upload" class="block text-sm font-medium text-gray-700">
          Imagen del producto
        </label>
        <div class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div class="space-y-1 text-center">
            {#if previewUrl}
              <div class="relative">
                <img 
                  src={previewUrl} 
                  alt="Vista previa" 
                  class="mx-auto h-48 w-auto object-contain"
                />
                <button
                  type="button"
                  on:click|preventDefault={() => {
                    previewUrl = '';
                    imageFile = null;
                  }}
                  class="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  aria-label="Eliminar imagen"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Eliminar imagen</title>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            {:else}
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <title>Icono de carga de imagen</title>
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex flex-col items-center text-sm text-gray-600">
                <div class="flex">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Subir una imagen</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      on:change={handleImageUpload}
                      aria-describedby="file-upload-description"
                    />
                  </label>
                  <p class="pl-1">o arrastra y suelta</p>
                </div>
                <p id="file-upload-description" class="text-xs text-gray-500">
                  PNG, JPG, GIF hasta 10MB
                </p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
    <button
      type="button"
      class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      on:click={() => dispatch('cancel')}
      disabled={loading}
    >
      Cancelar
    </button>
    <button
      type="button"
      class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={handleSubmit}
      disabled={!isFormValid || loading}
    >
      {#if loading}
        <svg class="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Guardando...
      {:else}
        {product.id ? 'Guardar cambios' : 'Crear producto'}
      {/if}
    </button>
  </div>
</div>
