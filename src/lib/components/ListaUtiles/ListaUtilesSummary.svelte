<script lang="ts">
  import { getListaUtilesSummary, formatListaUtilesSummary, listaUtilesStore } from '$lib/stores/listaUtiles';
  import { onMount } from 'svelte';
  
  let summaryText = '';
  
  // Función para actualizar el resumen
  const updateSummary = () => {
    const summary = getListaUtilesSummary();
    summaryText = formatListaUtilesSummary(summary);
  };
  
  // Actualizar el resumen cuando se carga el componente
  onMount(() => {
    updateSummary();
    
    // Suscribirse a cambios en el store para actualizar el resumen cuando cambie
    const unsubscribe = listaUtilesStore.subscribe(updateSummary);
    
    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  });
</script>

<div class="bg-white rounded-lg shadow-md p-6 my-4">
  <h2 class="text-xl font-bold mb-4">📋 Resumen de la Lista de Útiles</h2>
  
  {#if summaryText}
    <div class="whitespace-pre-line text-gray-700">
      {@html summaryText.replace(/\n/g, '<br>')}
    </div>
  {:else}
    <p class="text-gray-500">Carga una lista de útiles para ver el resumen</p>
  {/if}
  
  <div class="mt-4 text-sm text-gray-500">
    <p>ℹ️ Los precios son referenciales y pueden variar.</p>
  </div>
</div>

<style>
  /* Estilos para el resumen */
  :global(.summary-item) {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  :global(.summary-item:last-child) {
    border-bottom: none;
  }
  
  :global(.summary-total) {
    font-weight: bold;
    margin-top: 1rem;
    padding-top: 0.5rem;
    border-top: 2px solid #e5e7eb;
  }
</style>
