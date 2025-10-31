<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  interface Address {
    id: string;
    street: string;
    number: string;
    apartment?: string;
    city: string;
    region: string;
    postalCode: string;
    isDefault: boolean;
    contactName: string;
    contactPhone: string;
  }

  let addresses = $state<Address[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let showForm = $state(false);
  let editingAddress = $state<Address | null>(null);
  
  // Form fields
  let formData = $state({
    street: '',
    number: '',
    apartment: '',
    city: '',
    region: '',
    postalCode: '',
    isDefault: false,
    contactName: '',
    contactPhone: ''
  });

  // Fetch addresses on mount
  onMount(async () => {
    try {
      loading = true;
      // In a real app, this would be an API call
      // const response = await fetch('/api/account/addresses');
      // addresses = await response.json();
      
      // Mock data for now
      setTimeout(() => {
        addresses = [
          {
            id: '1',
            street: 'Av. Providencia',
            number: '1234',
            apartment: 'Depto 45',
            city: 'Santiago',
            region: 'Región Metropolitana',
            postalCode: '7500000',
            isDefault: true,
            contactName: 'Juan Pérez',
            contactPhone: '+56912345678'
          },
          {
            id: '2',
            street: 'Pedro de Valdivia',
            number: '4567',
            city: 'Santiago',
            region: 'Región Metropolitana',
            postalCode: '7500001',
            isDefault: false,
            contactName: 'Juan Pérez',
            contactPhone: '+56987654321'
          }
        ];
        loading = false;
      }, 500);
    } catch (err) {
      console.error('Error loading addresses:', err);
      error = 'No se pudieron cargar las direcciones. Por favor, intente nuevamente.';
      loading = false;
    }
  });

  function openForm(address: Address | null = null) {
    editingAddress = address;
    if (address) {
      formData = { ...address };
    } else {
      formData = {
        street: '',
        number: '',
        apartment: '',
        city: '',
        region: '',
        postalCode: '',
        isDefault: addresses.length === 0, // Default to true if first address
        contactName: '',
        contactPhone: ''
      };
    }
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingAddress = null;
  }

  async function saveAddress() {
    try {
      // In a real app, this would be an API call
      // const url = editingAddress 
      //   ? `/api/account/addresses/${editingAddress.id}` 
      //   : '/api/account/addresses';
      // const method = editingAddress ? 'PUT' : 'POST';
      
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Mock save
      if (editingAddress) {
        // Update existing address
        addresses = addresses.map(addr => 
          addr.id === editingAddress!.id ? { ...formData, id: addr.id } : addr
        );
      } else {
        // Add new address
        const newAddress = { ...formData, id: Date.now().toString() };
        addresses = [...addresses, newAddress];
      }
      
      closeForm();
    } catch (err) {
      console.error('Error saving address:', err);
      error = 'Error al guardar la dirección. Por favor, intente nuevamente.';
    }
  }

  async function deleteAddress(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta dirección?')) return;
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
      
      // Mock delete
      addresses = addresses.filter(addr => addr.id !== id);
    } catch (err) {
      console.error('Error deleting address:', err);
      error = 'Error al eliminar la dirección. Por favor, intente nuevamente.';
    }
  }

  function setDefaultAddress(id: string) {
    // In a real app, this would be an API call
    // await fetch(`/api/account/addresses/${id}/set-default`, { method: 'PUT' });
    
    // Mock set default
    addresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
  }
</script>

<div class="max-w-4xl mx-auto p-4 sm:p-6">
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-900">Mis Direcciones</h1>
    <p class="mt-1 text-sm text-gray-500">Administra tus direcciones de envío</p>
  </div>

  {#if error}
    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
  {/if}

  <!-- Add Address Button -->
  <div class="mb-6">
    <button
      on:click|preventDefault={() => openForm()}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      Agregar dirección
    </button>
  </div>

  <!-- Loading State -->
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  
  <!-- Addresses List -->
  {:else if addresses.length > 0}
    <div class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      {#each addresses as address (address.id)}
        <div 
          class="bg-white overflow-hidden shadow rounded-lg border-2 {address.isDefault ? 'border-indigo-500' : 'border-gray-200'}"
          in:fade
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {address.contactName}
                </h3>
                {#if address.isDefault}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                    Predeterminada
                  </span>
                {/if}
              </div>
              <div class="flex space-x-2">
                <button
                  on:click|preventDefault={() => openForm(address)}
                  class="text-indigo-600 hover:text-indigo-900"
                  title="Editar"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  on:click|preventDefault={() => deleteAddress(address.id)}
                  class="text-red-600 hover:text-red-900"
                  title="Eliminar"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="mt-4 text-sm text-gray-600 space-y-1">
              <p>{address.street} {address.number}{address.apartment ? `, ${address.apartment}` : ''}</p>
              <p>{address.city}, {address.region}</p>
              <p>{address.postalCode}</p>
              <p class="mt-2">
                <span class="font-medium">Teléfono:</span> {address.contactPhone}
              </p>
            </div>
            
            {#if !address.isDefault}
              <div class="mt-4">
                <button
                  on:click|preventDefault={() => setDefaultAddress(address.id)}
                  class="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Establecer como predeterminada
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  
  <!-- Empty State -->
  {:else}
    <div class="text-center py-12 bg-white rounded-lg shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No tienes direcciones guardadas</h3>
      <p class="mt-1 text-sm text-gray-500">Comienza agregando tu primera dirección de envío.</p>
      <div class="mt-6">
        <button
          on:click|preventDefault={() => openForm()}
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Agregar dirección
        </button>
      </div>
    </div>
  {/if}

  <!-- Add/Edit Address Modal -->
  {#if showForm}
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" on:click|self={closeForm}></div>

        <!-- Modal panel -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              on:click|preventDefault={closeForm}
            >
              <span class="sr-only">Cerrar</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {editingAddress ? 'Editar dirección' : 'Agregar nueva dirección'}
              </h3>
              <div class="mt-6 space-y-4">
                <div>
                  <label for="contactName" class="block text-sm font-medium text-gray-700">Nombre de contacto</label>
                  <input
                    type="text"
                    id="contactName"
                    bind:value={formData.contactName}
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                
                <div>
                  <label for="contactPhone" class="block text-sm font-medium text-gray-700">Teléfono de contacto</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    bind:value={formData.contactPhone}
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Ej: +56912345678"
                  />
                </div>
                
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div class="sm:col-span-2">
                    <label for="street" class="block text-sm font-medium text-gray-700">Calle</label>
                    <input
                      type="text"
                      id="street"
                      bind:value={formData.street}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Ej: Av. Providencia"
                    />
                  </div>
                  
                  <div>
                    <label for="number" class="block text-sm font-medium text-gray-700">Número</label>
                    <input
                      type="text"
                      id="number"
                      bind:value={formData.number}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="1234"
                    />
                  </div>
                  
                  <div>
                    <label for="apartment" class="block text-sm font-medium text-gray-700">Depto/Oficina (opcional)</label>
                    <input
                      type="text"
                      id="apartment"
                      bind:value={formData.apartment}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Ej: Depto 45"
                    />
                  </div>
                  
                  <div class="sm:col-span-2">
                    <label for="city" class="block text-sm font-medium text-gray-700">Ciudad</label>
                    <input
                      type="text"
                      id="city"
                      bind:value={formData.city}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Ej: Santiago"
                    />
                  </div>
                  
                  <div class="sm:col-span-2">
                    <label for="region" class="block text-sm font-medium text-gray-700">Región</label>
                    <select
                      id="region"
                      bind:value={formData.region}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Selecciona una región</option>
                      <option value="Arica y Parinacota">Arica y Parinacota</option>
                      <option value="Tarapacá">Tarapacá</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Atacama">Atacama</option>
                      <option value="Coquimbo">Coquimbo</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Metropolitana">Región Metropolitana</option>
                      <option value="O'Higgins">Libertador General Bernardo O'Higgins</option>
                      <option value="Maule">Maule</option>
                      <option value="Ñuble">Ñuble</option>
                      <option value="Biobío">Biobío</option>
                      <option value="La Araucanía">La Araucanía</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="Los Lagos">Los Lagos</option>
                      <option value="Aysén">Aysén del General Carlos Ibáñez del Campo</option>
                      <option value="Magallanes">Magallanes y de la Antártica Chilena</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="postalCode" class="block text-sm font-medium text-gray-700">Código Postal</label>
                    <input
                      type="text"
                      id="postalCode"
                      bind:value={formData.postalCode}
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Ej: 7500000"
                    />
                  </div>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="isDefault"
                    type="checkbox"
                    bind:checked={formData.isDefault}
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label for="isDefault" class="ml-2 block text-sm text-gray-700">
                    Establecer como dirección predeterminada
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              on:click|preventDefault={saveAddress}
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
            >
              {editingAddress ? 'Guardar cambios' : 'Agregar dirección'}
            </button>
            <button
              type="button"
              on:click|preventDefault={closeForm}
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
