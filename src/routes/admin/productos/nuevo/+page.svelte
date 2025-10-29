<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import ProductForm from '$lib/components/admin/ProductForm.svelte';
  import { showToast } from '$lib/stores/toast';
  
  let loading = $state(false);
  let categories = $state([]);
  
  const product = $state({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: ''
  });
  
  // Cargar categorías al montar el componente
  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }

  onMount(() => {
    // Cargar categorías al montar el componente
    (async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (!response.ok) throw new Error('Error al cargar categorías');
        const data = await response.json();
        categories = data.data || [];
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar las categorías', 'error');
      }
    })();

    // Configurar el evento beforeunload
    if (browser) {
      window.addEventListener('beforeunload', handleLogout);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('beforeunload', handleLogout);
    }
  });
  
  async function handleSubmit(formData: FormData) {
    try {
      loading = true;
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el producto');
      }
      
      showToast('Producto creado correctamente', 'success');
      goto('/admin/productos');
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Error al crear el producto', 'error');
    } finally {
      loading = false;
    }
  }
  
  function handleCancel() {
    if (confirm('¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.')) {
      goto('/admin/productos');
    }
  }
</script>

<div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 sm:px-0">
    <h1 class="text-2xl font-semibold text-gray-900">Nuevo Producto</h1>
    <p class="mt-1 text-sm text-gray-600">
      Completa la información del nuevo producto. Los campos marcados con <span class="text-red-500">*</span> son obligatorios.
    </p>
  </div>
  
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
</div>
