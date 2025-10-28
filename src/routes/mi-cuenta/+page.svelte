<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  // User profile state
  let user = $state({
    name: 'Nombre del Usuario',
    email: 'usuario@ejemplo.com',
    phone: '+54 11 1234-5678',
    address: 'Dirección del usuario, Ciudad, Provincia',
    joinDate: 'Enero 2023'
  });
  
  // Orders state
  let orders = $state([
    { id: '#12345', date: '15/10/2023', status: 'Completado', total: 12500, items: 3 },
    { id: '#12344', date: '01/10/2023', status: 'Enviado', total: 8990, items: 2 },
    { id: '#12340', date: '20/09/2023', status: 'Entregado', total: 15750, items: 5 },
  ]);
  
  // Active tab state
  let activeTab = $state('perfil');
  
  // Form states
  let editMode = $state(false);
  let formData = $state({ ...user });
  
  // Handle form submission
  function handleSubmit() {
    user = { ...formData };
    editMode = false;
    // Aquí iría la llamada a la API para actualizar el perfil del usuario
  }
  
  // Format currency
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount);
  }
  
  // Navigate to order details
  function viewOrder(orderId: string) {
    goto(`/mi-cuenta/pedidos/${orderId}`);
  }
</script>

<div class="py-8 min-h-screen bg-gray-50">
  <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <!-- Header con estadísticas -->
    <div class="mb-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">Mi Cuenta</h1>
          <p class="mt-2 text-sm text-gray-600">
            Bienvenido de vuelta, {user.name.split(' ')[0]}! Aquí puedes gestionar tu perfil, pedidos y direcciones.
          </p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4
          {activeTab === 'perfil' ? 'opacity-0' : ''}
          transition-opacity duration-200">
          <a href="/catalogo" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Seguir comprando
          </a>
        </div>
      </div>
      
      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 bg-indigo-500 rounded-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div class="flex-1 ml-5 w-0">
                <dt class="text-sm font-medium text-gray-500 truncate">Pedidos totales</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{orders.length}</div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 bg-green-500 rounded-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="flex-1 ml-5 w-0">
                <dt class="text-sm font-medium text-gray-500 truncate">Completados</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {orders.filter(o => o.status === 'Completado' || o.status === 'Entregado').length}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 bg-blue-500 rounded-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1 ml-5 w-0">
                <dt class="text-sm font-medium text-gray-500 truncate">En proceso</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {orders.filter(o => o.status === 'Enviado').length}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 bg-yellow-500 rounded-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="flex-1 ml-5 w-0">
                <dt class="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {orders.filter(o => o.status === 'Pendiente').length}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div class="overflow-hidden mb-8 bg-white shadow sm:rounded-lg">
      <!-- Tabs mejoradas -->
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            class="py-4 px-6 text-center border-b-2 font-medium text-sm
              {activeTab === 'perfil'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              flex items-center justify-center space-x-2"
            onclick={() => activeTab = 'perfil'}
            type="button"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Mi Perfil</span>
          </button>
          
          <button
            class="py-4 px-6 text-center border-b-2 font-medium text-sm
              {activeTab === 'pedidos'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              flex items-center justify-center space-x-2"
            onclick={() => activeTab = 'pedidos'}
            type="button"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Mis Pedidos</span>
            {#if orders.length > 0}
              <span class="inline-flex items-center px-2.5 py-0.5 ml-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                {orders.length}
              </span>
            {/if}
          </button>
          
          <button
            class="py-4 px-6 text-center border-b-2 font-medium text-sm
              {activeTab === 'direcciones'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              flex items-center justify-center space-x-2"
            onclick={() => activeTab = 'direcciones'}
            type="button"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Direcciones</span>
          </button>
        </nav>
      </div>
    </div>
  
  <!-- Profile Tab -->
  {#if activeTab === 'perfil'}
    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
      <!-- Encabezado del perfil con avatar -->
      <div class="px-4 py-5 sm:px-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span class="inline-block overflow-hidden w-16 h-16 bg-gray-100 rounded-full">
              <svg class="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-gray-900">{user.name}</h3>
            <p class="text-sm text-gray-600">Miembro desde {user.joinDate}</p>
          </div>
          <div class="ml-auto">
            {#if !editMode}
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onclick={() => {
                  formData = { ...user };
                  editMode = true;
                }}
              >
                <svg class="mr-2 -ml-1 w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar perfil
              </button>
            {/if}
          </div>
        </div>
      </div>
      
      <div class="px-4 py-5 border-t border-gray-200 sm:p-0">
        {#if editMode}
          <form onsubmit="{(e) => {
            e.preventDefault();
            handleSubmit();
          }}" class="p-6 space-y-6">
            <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="name" class="block text-sm font-medium text-gray-700">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  bind:value={formData.name}
                  class="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div class="sm:col-span-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  bind:value={formData.email}
                  class="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div class="sm:col-span-3">
                <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  bind:value={formData.phone}
                  class="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div class="sm:col-span-6">
                <label for="address" class="block text-sm font-medium text-gray-700">Dirección</label>
                <textarea
                  id="address"
                  rows="3"
                  bind:value={formData.address}
                  class="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onclick={() => editMode = false}
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        {:else}
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Nombre completo</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Correo electrónico</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Dirección</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.address}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Miembro desde</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.joinDate}</dd>
            </div>
          </dl>
        {/if}
      </div>
    </div>
  
  <!-- Orders Tab -->
  {:else if activeTab === 'pedidos'}
    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Mis Pedidos</h3>
            <p class="mt-1 text-sm text-gray-600">Revisa el estado de tus pedidos recientes</p>
          </div>
          <div class="mt-4 sm:mt-0">
            <div class="relative rounded-md shadow-sm">
              <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input type="text" class="block py-2 pl-10 w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Buscar pedidos...">
            </div>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-200">
        {#if orders.length === 0}
          <div class="py-12 text-center">
            <svg class="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
            <p class="mt-1 text-sm text-gray-500">Aún no has realizado ningún pedido.</p>
            <div class="mt-6">
              <a href="/catalogo" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg class="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Ver productos
              </a>
            </div>
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Pedido</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Fecha</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Estado</th>
                  <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Total</th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each orders as order (order.id)}
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{order.date}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        {order.status === 'Completado' ? 'bg-green-100 text-green-800' : 
                         order.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                         'bg-yellow-100 text-yellow-800'}">
                        {order.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{formatCurrency(order.total)}</td>
                    <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button 
                        onclick={() => viewOrder(order.id)}
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    </div>
  
  <!-- Addresses Tab -->
  {:else if activeTab === 'direcciones'}
    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Mis Direcciones</h3>
            <p class="mt-1 text-sm text-gray-600">Gestiona tus direcciones de envío y facturación</p>
          </div>
          <div class="mt-4 sm:mt-0">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Agregar dirección
            </button>
          </div>
        </div>
      </div>
      
      <div class="px-4 py-5 border-t border-gray-200 sm:p-0">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Default Address Card -->
          <div class="relative p-4 rounded-lg border">
            <div class="absolute top-2 right-2">
              <span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                Predeterminada
              </span>
            </div>
            <h4 class="font-medium text-gray-900">Casa</h4>
            <p class="mt-1 text-sm text-gray-600">
              {user.address}<br>
              Buenos Aires, C1428<br>
              Argentina
            </p>
            <div class="flex mt-4 space-x-3">
              <button type="button" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Editar</button>
              <button type="button" class="text-sm font-medium text-gray-500 hover:text-gray-700">Eliminar</button>
            </div>
          </div>
          
          <!-- Add New Address Card -->
          <div class="p-6 text-center rounded-lg border-2 border-dashed hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <h4 class="mt-2 text-sm font-medium text-gray-900">Agregar dirección</h4>
            <p class="mt-1 text-sm text-gray-500">Guarda direcciones para agilizar el proceso de compra.</p>
          </div>
        </div>
      </div>
    </div>
  {/if}
  </div>
</div>
