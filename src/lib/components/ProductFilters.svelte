<script lang="ts">
  interface Props {
    categories: string[];
    searchTerm: string;
    selectedCategory: string;
    onSearch: (event: Event) => void;
    onCategoryChange: (event: Event) => void;
    onReset: () => void;
  }

  let { categories, searchTerm, selectedCategory, onSearch, onCategoryChange, onReset }: Props = $props();

  let minPrice = $state('');
  let maxPrice = $state('');
  let showPriceFilter = $state(false);

  function handlePriceSubmit() {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;

    if (min !== undefined && max !== undefined && min > max) {
      alert('El precio mínimo no puede ser mayor al precio máximo');
      return;
    }

    // TODO: Implementar filtro de precio cuando esté disponible en la API
    console.log('Filtro de precio:', { min, max });
  }

  function togglePriceFilter() {
    showPriceFilter = !showPriceFilter;
    if (!showPriceFilter) {
      minPrice = '';
      maxPrice = '';
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
  <h3 class="text-lg font-semibold text-gray-900 mb-4">🔍 Filtros</h3>

  <!-- Búsqueda -->
  <div class="mb-6">
    <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
      Buscar productos
    </label>
    <input
      type="text"
      id="search"
      placeholder="Nombre, descripción..."
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={searchTerm}
      oninput={onSearch}
    />
  </div>

  <!-- Categoría -->
  <div class="mb-6">
    <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
      Categoría
    </label>
    <select
      id="category"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={selectedCategory}
      onchange={onCategoryChange}
    >
      <option value="">Todas las categorías</option>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>

  <!-- Filtro de precio (placeholder para futuro) -->
  <div class="mb-6">
    <button
      type="button"
      class="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
      onclick={togglePriceFilter}
    >
      <span>Rango de precio</span>
      <svg class="w-5 h-5 transition-transform {showPriceFilter ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    {#if showPriceFilter}
      <div class="mt-3 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="minPrice" class="block text-xs font-medium text-gray-600 mb-1">
              Mínimo ($)
            </label>
            <input
              type="number"
              id="minPrice"
              placeholder="0"
              min="0"
              step="0.01"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              bind:value={minPrice}
            />
          </div>
          <div>
            <label for="maxPrice" class="block text-xs font-medium text-gray-600 mb-1">
              Máximo ($)
            </label>
            <input
              type="number"
              id="maxPrice"
              placeholder="∞"
              min="0"
              step="0.01"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              bind:value={maxPrice}
            />
          </div>
        </div>
        <div class="flex space-x-2">
          <button
            type="button"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors duration-200"
            onclick={handlePriceSubmit}
          >
            Aplicar
          </button>
          <button
            type="button"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-3 rounded text-sm font-medium transition-colors duration-200"
            onclick={() => { minPrice = ''; maxPrice = ''; }}
          >
            Limpiar
          </button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Botón de reset -->
  <div class="pt-4 border-t border-gray-200">
    <button
      type="button"
      class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors duration-200"
      onclick={onReset}
    >
      🔄 Limpiar filtros
    </button>
  </div>
</div>
