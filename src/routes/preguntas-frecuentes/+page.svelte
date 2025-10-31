<script lang="ts">
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  
  // Set page metadata
  $: $page.data.metadata = {
    title: 'Preguntas Frecuentes',
    description: 'Encuentra respuestas a las preguntas más comunes sobre nuestras compras, envíos, devoluciones y más.'
  };

  // FAQ categories and questions
  const categories = [
    {
      id: 'pedidos',
      title: 'Pedidos y Pagos',
      icon: 'M3 10h18M7 15h1m4 0h1m-1-4h1m4 0h1m-9 5h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v4a3 3 0 003 3z',
      questions: [
        {
          q: '¿Cómo realizo un pedido?',
          a: 'Puedes realizar tu pedido de la siguiente manera:\n1. Busca el libro que deseas comprar\n2. Haz clic en "Agregar al carrito"\n3. Dirígete al carrito de compras\n4. Completa el proceso de pago con tus datos de envío y método de pago preferido'
        },
        {
          q: '¿Qué métodos de pago aceptan?',
          a: 'Aceptamos múltiples métodos de pago para tu comodidad:\n- Tarjetas de crédito y débito (Visa, Mastercard, American Express)\n- PayPal\n- Transferencia bancaria\n- Pago contra entrega (solo en algunas zonas)'
        },
        {
          q: '¿Cómo sé si mi pedido fue recibido?',
          a: 'Recibirás un correo de confirmación con los detalles de tu pedido una vez que este haya sido procesado exitosamente. También puedes revisar el estado de tus pedidos en la sección "Mis Pedidos" dentro de tu cuenta.'
        }
      ]
    },
    {
      id: 'envios',
      title: 'Envíos y Entregas',
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
      questions: [
        {
          q: '¿Cuáles son los costos de envío?',
          a: 'Los costos de envío varían según la ubicación y el peso del paquete. Puedes calcular el costo exacto en el carrito de compras antes de finalizar tu pedido. Ofrecemos envío gratuito en compras superiores a $50.000 en todo el país.'
        },
        {
          q: '¿Cuánto tarda en llegar mi pedido?',
          a: 'El tiempo de entrega varía según tu ubicación:\n- Bogotá: 1-2 días hábiles\n- Otras ciudades principales: 2-4 días hábiles\n- Otras zonas del país: 3-7 días hábiles\n\nLos tiempos pueden variar en días festivos o temporadas altas.'
        },
        {
          q: '¿Hacen envíos internacionales?',
          a: 'Sí, realizamos envíos internacionales. Los costos y tiempos de entrega varían según el país de destino. Para más información, contáctanos directamente con la dirección de envío para cotizar el costo.'
        }
      ]
    },
    {
      id: 'devoluciones',
      title: 'Devoluciones y Reembolsos',
      icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z',
      questions: [
        {
          q: '¿Cuál es la política de devoluciones?',
          a: 'Aceptamos devoluciones dentro de los 15 días posteriores a la recepción del pedido. Los productos deben estar en perfecto estado, con su empaque original y sin señales de uso. No se aceptan devoluciones de libros digitales o códigos de activación ya canjeados.'
        },
        {
          q: '¿Cómo puedo realizar una devolución?',
          a: 'Para iniciar una devolución:\n1. Contacta a nuestro servicio al cliente\n2. Proporciona el número de pedido y motivo de la devolución\n3. Te enviaremos las instrucciones para el envío de vuelta\n4. Una vez recibido y verificado el producto, procesaremos tu reembolso'
        },
        {
          q: '¿Cuánto tarda el reembolso?',
          a: 'Una vez recibido y verificado el producto, el reembolso se procesará dentro de los 5-7 días hábiles. El tiempo que tarde en reflejarse en tu cuenta dependerá de tu entidad financiera.'
        }
      ]
    },
    {
      id: 'cuenta',
      title: 'Cuenta y Seguridad',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      questions: [
        {
          q: '¿Cómo cambio mi contraseña?',
          a: 'Para cambiar tu contraseña:\n1. Inicia sesión en tu cuenta\n2. Ve a "Configuración de la cuenta"\n3. Haz clic en "Cambiar contraseña"\n4. Ingresa tu contraseña actual y la nueva contraseña\n5. Haz clic en "Guardar cambios"'
        },
        {
          q: '¿Qué hago si olvidé mi contraseña?',
          a: 'Si olvidaste tu contraseña, sigue estos pasos:\n1. En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?"\n2. Ingresa tu correo electrónico registrado\n3. Recibirás un enlace para restablecer tu contraseña\n4. Sigue las instrucciones en el correo para crear una nueva contraseña'
        },
        {
          q: '¿Cómo actualizo mi información personal?',
          a: 'Puedes actualizar tu información personal en cualquier momento accediendo a "Mi cuenta" y seleccionando "Editar perfil". Asegúrate de guardar los cambios realizados.'
        }
      ]
    },
    {
      id: 'productos',
      title: 'Productos y Stock',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      questions: [
        {
          q: '¿Cómo sé si un libro está disponible?',
          a: 'La disponibilidad de cada libro se muestra en su página de producto. Si un libro está agotado, puedes activar la notificación de disponibilidad para recibir un correo cuando vuelva a estar en stock.'
        },
        {
          q: '¿Puedo reservar un libro que no está disponible?',
          a: 'Sí, ofrecemos la opción de pre-ordenar libros que aún no han sido publicados o están en proceso de reabastecimiento. Simplemente haz clic en "Notificarme cuando esté disponible" en la página del producto.'
        },
        {
          q: '¿Los precios incluyen IVA?',
          a: 'Sí, todos los precios mostrados en nuestro sitio web ya incluyen el IVA correspondiente. El desglose de impuestos se muestra en el resumen de tu compra antes de finalizar el pedido.'
        }
      ]
    }
  ];

  // State for active category and expanded questions
  let activeCategory = categories[0].id;
  let expandedQuestions = new Set();

  // Toggle question expansion
  function toggleQuestion(questionId: string) {
    if (expandedQuestions.has(questionId)) {
      expandedQuestions.delete(questionId);
    } else {
      expandedQuestions.add(questionId);
    }
    expandedQuestions = new Set(expandedQuestions);
  }

  // Generate unique ID for each question
  function getQuestionId(categoryId: string, index: number): string {
    return `${categoryId}-${index}`;
  }
</script>

<svelte:head>
  <title>Preguntas Frecuentes - Librería</title>
  <meta name="description" content="Encuentra respuestas a las preguntas más comunes sobre nuestras compras, envíos, devoluciones y más." />
</svelte:head>

<div class="bg-white py-16 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
        Preguntas Frecuentes
      </h1>
      <p class="mt-5 max-w-3xl mx-auto text-xl text-gray-500">
        Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios.
      </p>
    </div>

    <div class="bg-white shadow overflow-hidden rounded-lg">
      <div class="bg-white border-b border-gray-200">
        <div class="flex overflow-x-auto">
          <nav class="flex space-x-6 px-6" aria-label="Categorías">
            {#each categories as category}
              <button
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none {activeCategory === category.id 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                on:click|preventDefault={() => activeCategory = category.id}
                aria-current={activeCategory === category.id ? 'page' : undefined}
              >
                <div class="flex items-center">
                  <svg 
                    class="-ml-0.5 mr-2 h-5 w-5 {activeCategory === category.id ? 'text-indigo-500' : 'text-gray-400'}" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fill-rule="evenodd" d={category.icon} clip-rule="evenodd" />
                  </svg>
                  {category.title}
                </div>
              </button>
            {/each}
          </nav>
        </div>
      </div>

      <div class="divide-y divide-gray-200">
        {#each categories.filter(c => c.id === activeCategory) as category (category.id)}
          <div class="px-6 py-8">
            <div class="space-y-4">
              {#each category.questions as question, i (i)}
                {@const qid = getQuestionId(category.id, i)}
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    class="w-full px-6 py-4 text-left focus:outline-none"
                    on:click|preventDefault={() => toggleQuestion(qid)}
                    aria-expanded={expandedQuestions.has(qid)}
                    aria-controls={`faq-${qid}`}
                  >
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-medium text-gray-900">
                        {question.q}
                      </h3>
                      <svg 
                        class={`h-5 w-5 text-gray-400 transform transition-transform ${expandedQuestions.has(qid) ? 'rotate-180' : ''}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  
                  {#if expandedQuestions.has(qid)}
                    <div 
                      id={`faq-${qid}`}
                      class="px-6 pb-4 pt-0 text-gray-600"
                      transition:fade
                    >
                      {#each question.a.split('\n') as paragraph}
                        <p class="mt-2">{paragraph}</p>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="mt-12 bg-indigo-50 rounded-lg p-6 text-center">
      <h3 class="text-lg font-medium text-gray-900">¿No encuentras lo que buscas?</h3>
      <p class="mt-2 text-gray-600">
        Nuestro equipo de atención al cliente está aquí para ayudarte.
      </p>
      <div class="mt-4">
        <a 
          href="/contacto" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Contáctanos
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  [aria-expanded="true"] svg {
    transform: rotate(180deg);
  }
  
  [aria-expanded="true"] + div {
    display: block;
  }
  
  button:focus-visible {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
</style>
