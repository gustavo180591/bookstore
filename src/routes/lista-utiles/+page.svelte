<script lang="ts">
  import { onMount } from 'svelte';
  import ListaUtilesUpload from '$lib/components/ListaUtiles/ListaUtilesUpload.svelte';
  import ListaUtilesResults from '$lib/components/ListaUtiles/ListaUtilesResults.svelte';
  import { listaUtilesStore } from '$lib/stores/listaUtiles';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  // Redirigir al carrito si ya hay una lista procesada
  $: if ($listaUtilesStore.status === 'processed' && $page.url.pathname !== '/carrito') {
    goto('/carrito');
  }
</script>

<svelte:head>
  <title>Escaneo de Lista de Útiles - Librería Arco Iris</title>
  <meta name="description" content="Sube tu lista de útiles escolares y obtén un presupuesto al instante" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Escaneo de Lista de Útiles</h1>
  
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-xl font-semibold mb-4">¿Cómo funciona?</h2>
    <ol class="list-decimal pl-5 space-y-2 text-gray-700">
      <li>Sube una foto o PDF de tu lista de útiles</li>
      <li>Nuestro sistema identificará automáticamente los productos</li>
      <li>Revisa y confirma los productos reconocidos</li>
      <li>Recibe un presupuesto personalizado</li>
      <li>Agrégalo a tu carrito con un solo clic</li>
    </ol>
  </div>

  <ListaUtilesUpload />
  
  {#if $listaUtilesStore.status === 'processing'}
    <div class="mt-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Procesando tu lista de útiles...</p>
    </div>
  {/if}
  
  {#if $listaUtilesStore.status === 'error'}
    <div class="mt-8 bg-red-50 border-l-4 border-red-500 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {$listaUtilesStore.error || 'Ocurrió un error al procesar la lista. Por favor, inténtalo de nuevo.'}
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
