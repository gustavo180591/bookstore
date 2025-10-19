<script lang="ts">
  import { onMount } from 'svelte';
  import { listaUtilesStore } from '$lib/stores/listaUtiles';
  import { goto } from '$app/navigation';
  import ListaUtilesResults from '$lib/components/ListaUtiles/ListaUtilesResults.svelte';
  
  // Datos de ejemplo para mostrar cómo se vería una lista escaneada
  const exampleItems = [
    {
      id: '1',
      name: 'Cuaderno tapa dura',
      quantity: 2,
      unit: 'un',
      matchedProduct: {
        id: '101',
        name: 'Cuaderno Tapa Dura 48 Hojas Rayado',
        brand: 'Rivadavia',
        price: 12.50,
        inStock: true,
        image: '/images/products/cuaderno.jpg'
      },
      alternatives: [
        {
          id: '102',
          name: 'Cuaderno Tapa Blanda 48 Hojas',
          brand: 'Globus',
          price: 9.99,
          inStock: true,
          image: '/images/products/cuaderno-globus.jpg'
        }
      ]
    },
    {
      id: '2',
      name: 'Lapicera azul',
      quantity: 3,
      unit: 'un',
      matchedProduct: {
        id: '201',
        name: 'Lapicera Bic Azul',
        brand: 'Bic',
        price: 1.50,
        inStock: true,
        image: '/images/products/lapicera-bic.jpg'
      }
    },
    {
      id: '3',
      name: 'Regla 30cm',
      quantity: 1,
      unit: 'un',
      matchedProduct: {
        id: '301',
        name: 'Regla de Plástico 30cm',
        brand: 'Faber-Castell',
        price: 3.20,
        inStock: false,
        image: '/images/products/regla.jpg'
      },
      alternatives: [
        {
          id: '302',
          name: 'Regla de Plástico 30cm Transparente',
          brand: 'Maped',
          price: 2.99,
          inStock: true,
          image: '/images/products/regla-maped.jpg'
        }
      ]
    }
  ];

  // Cargar los datos de ejemplo al montar el componente
  onMount(() => {
    // @ts-ignore - Necesitamos acceder a la función set del store
    if (listaUtilesStore.set) {
      listaUtilesStore.set({
        items: exampleItems,
        status: 'completed',
        originalImage: '/images/example-list.jpg'
      });
    }
  });

  // Función para ir al escáner
  function goToScanner() {
    goto('/lista-utiles');
  }
</script>

<div class="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Lista de Útiles Escolar - Ejemplo
      </h1>
      <p class="mt-3 text-xl text-gray-500">
        Así es como se verá tu lista después de escanearla
      </p>
      <div class="mt-6">
        <button
          on:click={goToScanner}
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
          Escanear mi lista
        </button>
      </div>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div class="px-4 py-5 sm:px-6 bg-indigo-700 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold">
              Lista de Ejemplo - 3er Grado
            </h3>
            <p class="mt-1 text-indigo-100">
              Hemos encontrado 3 productos en tu lista
            </p>
          </div>
          <div class="bg-white/10 px-4 py-2 rounded-lg">
            <p class="text-sm font-medium">Total estimado</p>
            <p class="text-2xl font-bold">$32.20</p>
          </div>
        </div>
      </div>

      <div class="border-b border-gray-200">
        <img 
          src="/images/example-list.jpg" 
          alt="Lista de ejemplo escaneada"
          class="w-full h-auto border-b border-gray-200"
        />
        <div class="px-4 py-3 bg-gray-50 text-sm text-gray-500">
          <p>Así es como se ve una lista escaneada. Sube una imagen o PDF de tu lista y la procesaremos automáticamente.</p>
        </div>
      </div>

      <!-- Componente de resultados de la lista -->
      <svelte:component this={ListaUtilesResults} />
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          ¿Cómo funciona el escáner de listas?
        </h3>
        <div class="mt-5">
          <div class="space-y-6">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                  1
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-base font-medium text-gray-900">Toma una foto o escanea tu lista</h4>
                <p class="mt-1 text-sm text-gray-500">
                  Asegúrate de que la lista esté bien iluminada y se vea clara en la imagen.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                  2
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-base font-medium text-gray-900">Nuestro sistema procesa la lista</h4>
                <p class="mt-1 text-sm text-gray-500">
                  Identificamos los productos y los buscamos en nuestro catálogo automáticamente.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                  3
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-base font-medium text-gray-900">Revisa y personaliza</h4>
                <p class="mt-1 text-sm text-gray-500">
                  Verifica los productos detectados, selecciona alternativas si es necesario y agrega todo al carrito con un solo clic.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-10">
            <button
              on:click={goToScanner}
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Probar con mi lista
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Removed unused .fade-in class */
</style>
