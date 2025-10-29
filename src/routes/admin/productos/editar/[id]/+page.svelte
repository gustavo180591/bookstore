<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ProductForm from '$lib/components/admin/ProductForm.svelte';
  import { showToast } from '$lib/stores/toast';
  
  let loading = $state(true);
  let categories = $state([]);
  let product = $state({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: ''
  });
  
  // Cargar producto y categorías al montar el componente
  onMount(async () => {
    try {
      // Cargar categorías
      const categoriesResponse = await fetch('/api/admin/categories');
      if (!categoriesResponse.ok) throw new Error('Error al cargar categorías');
      categories = await categoriesResponse.json();
      
      // Cargar datos del producto
      const productId = $page.params.id;
      const productResponse = await fetch(`/api/admin/products/${productId}`);
      
      if (!productResponse.ok) {
        throw new Error('Producto no encontrado');
      }
      
      const productData = await productResponse.json();
      product = {
        id: productData.id,
        name: productData.name,
        description: productData.description || '',
        price: parseFloat(productData.price),
        stock: productData.stock || 0,
        category: productData.categoryId || '',
        imageUrl: productData.imageUrl || ''
      };
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Error al cargar el producto', 'error');
      goto('/admin/productos');
    } finally {
      loading = false;
    }
  });
  
  async function handleSubmit(formData: FormData) {
    try {
      loading = true;
      
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el producto');
      }
      
      showToast('Producto actualizado correctamente', 'success');
      goto('/admin/productos');
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Error al actualizar el producto', 'error');
    } finally {
      loading = false;
    }
  }
  
  function handleCancel() {
    if (confirm('¿Estás seguro de que deseas descartar los cambios?')) {
      goto('/admin/productos');
    }
  }
  
  async function handleDelete() {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      loading = true;
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar el producto');
      }
      
      showToast('Producto eliminado correctamente', 'success');
      goto('/admin/productos');
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Error al eliminar el producto', 'error');
      loading = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 sm:px-0">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Editar Producto</h1>
        <p class="mt-1 text-sm text-gray-600">
          Actualiza la información del producto. Los campos marcados con <span class="text-red-500">*</span> son obligatorios.
        </p>
      </div>
      <button
        type="button"
        on:click={handleDelete}
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        Eliminar
      </button>
    </div>
  </div>
  
  {#if loading && !product.id}
    <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Cargando producto...</p>
    </div>
  {:else}
    <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <ProductForm 
          {product} 
          {categories} 
          {loading}
          on:submit={({ detail }) => handleSubmit(detail)}
          on:cancel={handleCancel}
        />
      </div>
    </div>
  {/if}
</div>
