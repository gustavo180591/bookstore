<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Order } from '$lib/types';
  
  let orders: Order[] = [];
  let isLoading = true;
  
  onMount(async () => {
    try {
      // En una aplicación real, aquí harías una llamada a tu API
      // const response = await fetch('/api/orders');
      // orders = await response.json();
      
      // Datos de ejemplo
      orders = [
        {
          id: 'ORD-2023-001',
          date: '2023-10-15',
          total: 125.75,
          status: 'Entregado',
          items: 5
        },
        {
          id: 'ORD-2023-002',
          date: '2023-10-10',
          total: 89.99,
          status: 'En camino',
          items: 3
        },
        {
          id: 'ORD-2023-003',
          date: '2023-10-05',
          total: 42.50,
          status: 'Procesando',
          items: 2
        }
      ];
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
    } finally {
      isLoading = false;
    }
  });
  
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  }
  
  function getStatusClass(status: string) {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'en camino':
        return 'bg-blue-100 text-blue-800';
      case 'en preparación':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h1 class="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
      <p class="mt-1 text-sm text-gray-500">Revisa el estado de tus pedidos recientes.</p>
    </div>
    
    {#if isLoading}
      <div class="px-4 py-12 text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p class="mt-2 text-sm text-gray-500">Cargando tus pedidos...</p>
      </div>
    {:else if orders.length === 0}
      <div class="px-4 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
        <p class="mt-1 text-sm text-gray-500">Aún no has realizado ningún pedido.</p>
        <div class="mt-6">
          <a href="/" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Comprar ahora
          </a>
        </div>
      </div>
    {:else}
      <div class="bg-white overflow-hidden">
        <div class="hidden sm:block">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° de Pedido</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each orders as order (order.id)}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items} {order.items === 1 ? 'producto' : 'productos'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getStatusClass(order.status)}">
                      {order.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`/mi-cuenta/pedidos/${order.id}`} class="text-indigo-600 hover:text-indigo-900">Ver detalle</a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        
        <div class="sm:hidden">
          <div class="px-4 py-4 space-y-4">
            {#each orders as order (order.id)}
              <div class="bg-white shadow overflow-hidden rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <div class="flex justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">Pedido #{order.id}</p>
                      <p class="mt-1 text-sm text-gray-500">{formatDate(order.date)}</p>
                    </div>
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getStatusClass(order.status)}">
                      {order.status}
                    </span>
                  </div>
                  <div class="mt-4">
                    <p class="text-sm text-gray-500">{order.items} {order.items === 1 ? 'producto' : 'productos'}</p>
                    <p class="mt-1 text-lg font-medium text-gray-900">${order.total.toFixed(2)}</p>
                  </div>
                  <div class="mt-4 flex justify-end">
                    <a href={`/mi-cuenta/pedidos/${order.id}`} class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Ver detalle <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
