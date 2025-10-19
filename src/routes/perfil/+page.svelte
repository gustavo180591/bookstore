<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { User } from '$lib/types';
  
  let user: User | null = null;
  let activeTab = 'profile';
  let isEditing = false;
  let isLoading = true;
  let error: string | null = null;
  let success: string | null = null;
  
  onMount(async () => {
    await loadUserData();
  });
  
  const loadUserData = async () => {
    try {
      isLoading = true;
      error = null;
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        user = await response.json();
      } else if (response.status === 401) {
        await goto('/iniciar-sesion?redirect=/perfil');
      }
    } catch (err) {
      console.error('Error al cargar el perfil:', err);
      error = 'No se pudo cargar la información del perfil. Intente nuevamente.';
    } finally {
      isLoading = false;
    }
  };
  
  const updateProfile = async (e: Event) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      error = null;
      success = null;
      
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        success = 'Perfil actualizado correctamente';
        isEditing = false;
        await loadUserData(); // Recargar datos actualizados
      } else {
        error = data.message || 'Error al actualizar el perfil';
      }
    } catch (err) {
      console.error('Error al actualizar el perfil:', err);
      error = 'Error al conectar con el servidor';
    }
  };
  
  const startEditing = () => {
    error = null;
    success = null;
    isEditing = true;
  };
  
  const cancelEditing = () => {
    isEditing = false;
    error = null;
    success = null;
    loadUserData(); // Recargar datos originales
  };
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p class="mt-1 text-sm text-gray-500">Administra tu información personal y preferencias.</p>
      </div>
      
      {#if isLoading}
        <div class="p-6 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Cargando perfil...</p>
        </div>
      {:else if error}
        <div class="p-6">
          <div class="bg-red-50 border-l-4 border-red-400 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      {:else if !user}
        <div class="p-6 text-center">
          <p class="text-gray-600">Por favor inicia sesión para ver tu perfil.</p>
          <a href="/iniciar-sesion?redirect=/perfil" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Iniciar sesión
          </a>
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-b-lg">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                on:click={() => activeTab = 'profile'}
              >
                Perfil
              </button>
              <button
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'orders' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                on:click={() => activeTab = 'orders'}
              >
                Mis Pedidos
              </button>
              <button
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'settings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                on:click={() => activeTab = 'settings'}
              >
                Configuración
              </button>
            </nav>
          </div>
          
          {#if activeTab === 'profile'}
            <div class="px-4 py-5 sm:p-6">
              {#if success}
                <div class="mb-6 rounded-md bg-green-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-green-800">{success}</p>
                    </div>
                  </div>
                </div>
              {/if}
              
              {#if !isEditing}
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Información del Perfil</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">Detalles personales de la cuenta.</p>
                  </div>
                  <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl class="sm:divide-y sm:divide-gray-200">
                      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Nombre completo</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {user.firstName} {user.lastName}
                        </dd>
                      </div>
                      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Correo electrónico</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {user.email}
                        </dd>
                      </div>
                      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Miembro desde</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {new Date().toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="button"
                      on:click={startEditing}
                      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Editar perfil
                    </button>
                  </div>
                </div>
              {:else}
                <form on:submit={updateProfile} class="space-y-6">
                  <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                      <div class="md:col-span-1">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">Información Personal</h3>
                        <p class="mt-1 text-sm text-gray-500">Actualiza tu información de contacto.</p>
                      </div>
                      <div class="mt-5 md:mt-0 md:col-span-2">
                        <div class="grid grid-cols-6 gap-6">
                          <div class="col-span-6 sm:col-span-3">
                            <label for="first-name" class="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                              type="text"
                              id="first-name"
                              bind:value={user.firstName}
                              required
                              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div class="col-span-6 sm:col-span-3">
                            <label for="last-name" class="block text-sm font-medium text-gray-700">Apellido</label>
                            <input
                              type="text"
                              id="last-name"
                              bind:value={user.lastName}
                              required
                              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div class="col-span-6 sm:col-span-4">
                            <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
                            <input
                              type="email"
                              id="email"
                              bind:value={user.email}
                              disabled
                              class="mt-1 bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                            <p class="mt-2 text-sm text-gray-500">Para cambiar tu correo electrónico, por favor contacta a soporte.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-end">
                    <button
                      type="button"
                      on:click={cancelEditing}
                      class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              {/if}
            </div>
          {/if}
          
          {#if activeTab === 'orders'}
            <div class="px-4 py-5 sm:p-6">
              <p class="text-gray-600 mb-4">Aquí podrás ver el historial de tus pedidos.</p>
              <a href="/mi-cuenta/pedidos" class="text-indigo-600 hover:text-indigo-800 font-medium">
                Ver todos mis pedidos →
              </a>
            </div>
          {/if}
          
          {#if activeTab === 'settings'}
            <div class="px-4 py-5 sm:p-6">
              <div class="space-y-6">
                <div class="border-b border-gray-200 pb-5">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">Preferencias</h3>
                </div>
                
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="newsletter"
                      type="checkbox"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="newsletter" class="font-medium text-gray-700">Recibir ofertas y novedades</label>
                    <p class="text-gray-500">Recibe correos electrónicos con nuestras últimas ofertas y novedades.</p>
                  </div>
                </div>
                
                <div class="pt-5">
                  <div class="flex justify-end">
                    <button
                      type="button"
                      class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Guardar preferencias
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
