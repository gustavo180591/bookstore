<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  interface WishlistItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    imageUrl?: string;
    addedAt: string;
  }
  
  interface Wishlist {
    id: string;
    name: string;
    description?: string;
    isDefault: boolean;
    items: WishlistItem[];
    createdAt: string;
    updatedAt: string;
  }

  let wishlists = $state<Wishlist[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let showCreateForm = $state(false);
  let showAddItemForm = $state(false);
  let selectedWishlist = $state<Wishlist | null>(null);
  
  // Form data
  let newWishlist = $state({
    name: '',
    description: ''
  });
  
  let newItem = $state({
    productId: '',
    name: '',
    price: 0,
    imageUrl: ''
  });

  // Fetch wishlists on mount
  onMount(async () => {
    try {
      loading = true;
      // In a real app, this would be an API call
      // const response = await fetch('/api/account/wishlists');
      // wishlists = await response.json();
      
      // Mock data
      setTimeout(() => {
        wishlists = [
          {
            id: '1',
            name: 'Lista de deseos',
            description: 'Libros que me gustaría leer',
            isDefault: true,
            items: [
              {
                id: '1',
                productId: '101',
                name: 'Cien años de soledad',
                price: 12990,
                imageUrl: '/uploads/cien-anos-soledad.jpg',
                addedAt: '2023-10-20T15:30:00Z'
              },
              {
                id: '2',
                productId: '102',
                name: 'El amor en los tiempos del cólera',
                price: 11990,
                imageUrl: '/uploads/amor-tiempos-colera.jpg',
                addedAt: '2023-10-15T10:20:00Z'
              }
            ],
            createdAt: '2023-10-10T09:00:00Z',
            updatedAt: '2023-10-20T15:30:00Z'
          },
          {
            id: '2',
            name: 'Para regalar',
            description: 'Regalos para cumpleaños',
            isDefault: false,
            items: [],
            createdAt: '2023-09-15T14:20:00Z',
            updatedAt: '2023-09-15T14:20:00Z'
          }
        ];
        loading = false;
      }, 500);
    } catch (err) {
      console.error('Error loading wishlists:', err);
      error = 'No se pudieron cargar las listas. Por favor, intente nuevamente.';
      loading = false;
    }
  });

  function openCreateForm() {
    newWishlist = { name: '', description: '' };
    showCreateForm = true;
  }

  function closeCreateForm() {
    showCreateForm = false;
  }

  async function createWishlist() {
    if (!newWishlist.name.trim()) return;
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/account/wishlists', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newWishlist)
      // });
      // const createdList = await response.json();
      
      // Mock creation
      const createdList = {
        id: Date.now().toString(),
        name: newWishlist.name,
        description: newWishlist.description,
        isDefault: false,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      wishlists = [...wishlists, createdList];
      closeCreateForm();
    } catch (err) {
      console.error('Error creating wishlist:', err);
      error = 'Error al crear la lista. Por favor, intente nuevamente.';
    }
  }

  function openAddItemForm(wishlist: Wishlist) {
    selectedWishlist = wishlist;
    newItem = { productId: '', name: '', price: 0, imageUrl: '' };
    showAddItemForm = true;
  }

  function closeAddItemForm() {
    showAddItemForm = false;
    selectedWishlist = null;
  }

  async function addItem() {
    if (!selectedWishlist || !newItem.name.trim()) return;
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/account/wishlists/${selectedWishlist.id}/items`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newItem)
      // });
      // const addedItem = await response.json();
      
      // Mock addition
      const addedItem = {
        id: Date.now().toString(),
        productId: newItem.productId || `mock-${Date.now()}`,
        name: newItem.name,
        price: newItem.price,
        imageUrl: newItem.imageUrl || '',
        addedAt: new Date().toISOString()
      };
      
      wishlists = wishlists.map(wishlist => 
        wishlist.id === selectedWishlist!.id
          ? { 
              ...wishlist, 
              items: [...wishlist.items, addedItem],
              updatedAt: new Date().toISOString()
            }
          : wishlist
      );
      
      closeAddItemForm();
    } catch (err) {
      console.error('Error adding item:', err);
      error = 'Error al agregar el producto. Por favor, intente nuevamente.';
    }
  }

  async function removeItem(wishlistId: string, itemId: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto de la lista?')) return;
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/account/wishlists/${wishlistId}/items/${itemId}`, {
      //   method: 'DELETE'
      // });
      
      // Mock removal
      wishlists = wishlists.map(wishlist => 
        wishlist.id === wishlistId
          ? { 
              ...wishlist, 
              items: wishlist.items.filter(item => item.id !== itemId),
              updatedAt: new Date().toISOString()
            }
          : wishlist
      );
    } catch (err) {
      console.error('Error removing item:', err);
      error = 'Error al eliminar el producto. Por favor, intente nuevamente.';
    }
  }

  async function deleteWishlist(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta lista? Esta acción no se puede deshacer.')) return;
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/account/wishlists/${id}`, { method: 'DELETE' });
      
      // Mock deletion
      wishlists = wishlists.filter(wishlist => wishlist.id !== id);
    } catch (err) {
      console.error('Error deleting wishlist:', err);
      error = 'Error al eliminar la lista. Por favor, intente nuevamente.';
    }
  }

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Mis Listas de Deseos</h1>
      <p class="mt-1 text-sm text-gray-500">Administra tus listas de productos favoritos</p>
    </div>
    <button
      on:click|preventDefault={openCreateForm}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      Crear lista
    </button>
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

  <!-- Loading State -->
  {#if loading}
    <div class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  
  <!-- Empty State -->
  {:else if wishlists.length === 0}
    <div class="text-center py-16 bg-white rounded-lg shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No tienes listas de deseos</h3>
      <p class="mt-1 text-sm text-gray-500">Comienza creando tu primera lista de deseos.</p>
      <div class="mt-6">
        <button
          on:click|preventDefault={openCreateForm}
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Crear lista
        </button>
      </div>
    </div>
  
  <!-- Wishlists Grid -->
  {:else}
    <div class="space-y-8">
      {#each wishlists as wishlist (wishlist.id)}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg" in:fade>
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {wishlist.name}
                {#if wishlist.isDefault}
                  <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Predeterminada
                  </span>
                {/if}
              </h3>
              {#if wishlist.description}
                <p class="mt-1 max-w-2xl text-sm text-gray-500">{wishlist.description}</p>
              {/if}
              <p class="mt-1 text-xs text-gray-400">
                Actualizada el {formatDate(wishlist.updatedAt)} • {wishlist.items.length} {wishlist.items.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                on:click|preventDefault={() => openAddItemForm(wishlist)}
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Agregar
              </button>
              <button
                on:click|preventDefault={() => deleteWishlist(wishlist.id)}
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg class="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
          
          {#if wishlist.items.length > 0}
            <div class="border-t border-gray-200">
              <ul class="divide-y divide-gray-200">
                {#each wishlist.items as item (item.id)}
                  <li class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-200">
                        {#if item.imageUrl}
                          <img src={item.imageUrl} alt={item.name} class="h-full w-full object-cover">
                        {:else}
                          <div class="h-full w-full flex items-center justify-center text-gray-400">
                            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        {/if}
                      </div>
                      <div class="ml-4 flex-1">
                        <div class="flex items-center justify-between">
                          <h4 class="text-sm font-medium text-indigo-600">{item.name}</h4>
                          <p class="ml-2 text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
                        </div>
                        <div class="mt-1 flex items-center justify-between">
                          <p class="text-sm text-gray-500">Agregado el {formatDate(item.addedAt)}</p>
                          <button
                            on:click|preventDefault={() => removeItem(wishlist.id, item.id)}
                            class="text-red-600 hover:text-red-900"
                            title="Eliminar de la lista"
                          >
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          {:else}
            <div class="px-4 py-8 text-center bg-gray-50">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Lista vacía</h3>
              <p class="mt-1 text-sm text-gray-500">Agrega productos a esta lista para verlos aquí.</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Create Wishlist Modal -->
{#if showCreateForm}
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" on:click|self={closeCreateForm}></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            on:click|preventDefault={closeCreateForm}
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
              Crear nueva lista
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label for="wishlist-name" class="block text-sm font-medium text-gray-700">Nombre de la lista</label>
                <input
                  type="text"
                  id="wishlist-name"
                  bind:value={newWishlist.name}
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ej: Lista de cumpleaños"
                />
              </div>
              
              <div>
                <label for="wishlist-description" class="block text-sm font-medium text-gray-700">Descripción (opcional)</label>
                <textarea
                  id="wishlist-description"
                  bind:value={newWishlist.description}
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Agrega una descripción para tu lista"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            on:click|preventDefault={createWishlist}
            disabled={!newWishlist.name.trim()}
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed sm:col-start-2 sm:text-sm"
          >
            Crear lista
          </button>
          <button
            type="button"
            on:click|preventDefault={closeCreateForm}
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Add Item Modal -->
{#if showAddItemForm && selectedWishlist}
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" on:click|self={closeAddItemForm}></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            on:click|preventDefault={closeAddItemForm}
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
              Agregar a "{selectedWishlist.name}"
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label for="item-name" class="block text-sm font-medium text-gray-700">Nombre del producto</label>
                <input
                  type="text"
                  id="item-name"
                  bind:value={newItem.name}
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ej: Cien años de soledad"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="item-price" class="block text-sm font-medium text-gray-700">Precio</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="item-price"
                      bind:value={newItem.price}
                      min="0"
                      step="1"
                      class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center">
                      <span class="text-gray-500 sm:text-sm pr-3">CLP</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label for="item-image" class="block text-sm font-medium text-gray-700">URL de la imagen (opcional)</label>
                  <input
                    type="url"
                    id="item-image"
                    bind:value={newItem.imageUrl}
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>
              
              <div class="hidden">
                <label for="item-product-id" class="block text-sm font-medium text-gray-700">ID del producto</label>
                <input
                  type="text"
                  id="item-product-id"
                  bind:value={newItem.productId}
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ID del producto (opcional)"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            on:click|preventDefault={addItem}
            disabled={!newItem.name.trim()}
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed sm:col-start-2 sm:text-sm"
          >
            Agregar a la lista
          </button>
          <button
            type="button"
            on:click|preventDefault={closeAddItemForm}
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
