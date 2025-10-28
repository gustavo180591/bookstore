<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchProducts, type Product } from '$lib/api/products';

  // Estado para productos destacados
  let featuredProducts: Product[] = [];
  let loading = true;
  let error: string | null = null;

  // Cargar productos destacados
  onMount(async () => {
    try {
      const response = await fetchProducts({ limit: 6 });
      featuredProducts = response.data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar productos destacados';
    } finally {
      loading = false;
    }
  });

  function formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(numPrice);
  }
</script>

<svelte:head>
  <title>Bookstore - Librería Online | Útiles Escolares y de Oficina</title>
  <meta name="description" content="Tu librería online de confianza. Encuentra útiles escolares, libros, cuadernos y todo lo que necesitas para estudiar y trabajar. Envíos rápidos y precios competitivos." />
  <meta name="keywords" content="librería online, útiles escolares, libros, cuadernos, oficina, papelería" />
</svelte:head>

<div class="home-container">
  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">
          📚 Tu <span class="highlight">Librería Online</span> de Confianza
        </h1>
        <p class="hero-subtitle">
          Descubre nuestra amplia colección de útiles escolares, libros, cuadernos y artículos de oficina.
          Calidad garantizada y los mejores precios del mercado.
        </p>
        <div class="hero-actions">
          <a href="/catalogo" class="cta-button primary">
            🛍️ Explorar Catálogo
          </a>
          <a href="#featured" class="cta-button secondary">
            Ver Destacados
          </a>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-illustration">
          <div class="book-stack">
            <div class="book book-1">📖</div>
            <div class="book book-2">📚</div>
            <div class="book book-3">📓</div>
          </div>
          <div class="floating-elements">
            <div class="element element-1">✏️</div>
            <div class="element element-2">🖊️</div>
            <div class="element element-3">📐</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Escaneo de Listas Escolares -->
  <section class="scan-section">
    <div class="scan-container">
      <div class="scan-content">
        <div class="scan-text">
          <div class="scan-badge">✨ Nuevo</div>
          <h2 class="scan-title">Escanea tu Lista de Útiles</h2>
          <p class="scan-description">
            Sube una foto o PDF de tu lista escolar y nuestro sistema inteligente reconocerá automáticamente los productos.
            Obtén un presupuesto personalizado al instante.
          </p>
          <div class="scan-features">
            <div class="scan-feature">
              <span class="scan-feature-icon">📷</span>
              <span>Sube imagen o PDF</span>
            </div>
            <div class="scan-feature">
              <span class="scan-feature-icon">🤖</span>
              <span>Reconocimiento automático</span>
            </div>
            <div class="scan-feature">
              <span class="scan-feature-icon">💰</span>
              <span>Presupuesto instantáneo</span>
            </div>
          </div>
          <a href="/lista-utiles" class="scan-button">
            🚀 Comenzar a escanear
          </a>
        </div>
        <div class="scan-visual">
          <div class="scan-phone">
            <div class="scan-screen">
              <div class="scan-demo">
                <div class="demo-item">📚 Cuaderno A4</div>
                <div class="demo-item">✏️ Lápiz HB</div>
                <div class="demo-item">🖊️ Bolígrafo</div>
                <div class="demo-total">💰 Total: $450</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Características Mejoradas -->
  <section class="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          <span class="block">¿Por qué elegir Bookstore?</span>
        </h2>
        <p class="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
          Ofrecemos la mejor experiencia de compra en útiles escolares y de oficina
        </p>
      </div>

      <div class="mt-10">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Tarjeta 1 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="p-6 text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-2xl mb-4">
                🚚
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Envío Rápido</h3>
              <p class="text-gray-600 text-sm">
                Recibe tus pedidos en 24-48 horas en CABA y alrededores. Envíos gratuitos en compras mayores a $15.000.
              </p>
            </div>
          </div>

          <!-- Tarjeta 2 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="p-6 text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-2xl mb-4">
                💳
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Pago Seguro</h3>
              <p class="text-gray-600 text-sm">
                Múltiples formas de pago: tarjetas, transferencia bancaria y Mercado Pago. Todas tus transacciones protegidas.
              </p>
            </div>
          </div>

          <!-- Tarjeta 3 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="p-6 text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 text-2xl mb-4">
                ⭐
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Calidad Garantizada</h3>
              <p class="text-gray-600 text-sm">
                Trabajamos solo con las mejores marcas. Garantía de satisfacción en todos nuestros productos.
              </p>
            </div>
          </div>

          <!-- Tarjeta 4 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="p-6 text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 text-2xl mb-4">
                📞
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Atención Personalizada</h3>
              <p class="text-gray-600 text-sm">
                Nuestro equipo está disponible para asesorarte en tu compra. ¡Estamos para ayudarte!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Productos Destacados -->
  <section id="featured" class="featured-products">
    <div class="featured-container">
      <div class="section-header">
        <h2 class="section-title">Productos Destacados</h2>
        <p class="section-subtitle">
          Los más vendidos y favoritos de nuestros clientes
        </p>
        <a href="/catalogo" class="view-all-link">
          Ver todo el catálogo →
        </a>
      </div>

      <!-- Loading state -->
      {#if loading}
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <span class="loading-text">Cargando productos destacados...</span>
        </div>
      {/if}

      <!-- Error state -->
      {#if error}
        <div class="error-container">
          <div class="error-content">
            <h3 class="error-title">Error al cargar productos</h3>
            <p class="error-message">{error}</p>
            <button class="retry-button" onclick={async () => {
              loading = true;
              error = null;
              try {
                const response = await fetchProducts({ limit: 6 });
                featuredProducts = response.data;
              } catch (err) {
                error = err instanceof Error ? err.message : 'Error desconocido';
              } finally {
                loading = false;
              }
            }}>
              Reintentar
            </button>
          </div>
        </div>
      {/if}

      <!-- Productos -->
      {#if !loading && !error && featuredProducts.length > 0}
        <div class="featured-grid">
          {#each featuredProducts as product (product.id)}
            <div class="featured-card">
              <div class="featured-image">
                {#if product.imageUrl}
                  <img src={product.imageUrl} alt={product.name} class="featured-img" />
                {:else}
                  <div class="featured-placeholder">
                    <span class="featured-icon">📚</span>
                  </div>
                {/if}
              </div>
              <div class="featured-info">
                <div class="featured-meta">
                  {#if product.category}
                    <span class="featured-category">{product.category}</span>
                  {/if}
                </div>
                <h3 class="featured-name">{product.name}</h3>
                {#if product.description}
                  <p class="featured-description">{product.description}</p>
                {/if}
                <div class="featured-footer">
                  <span class="featured-price">{formatPrice(product.price)}</span>
                  <a href="/catalogo" class="featured-link">Ver detalles</a>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- Newsletter -->
  <section class="newsletter">
    <div class="newsletter-container">
      <div class="newsletter-content">
        <h2 class="newsletter-title">📧 ¡Suscríbete a nuestras ofertas!</h2>
        <p class="newsletter-subtitle">
          Recibe descuentos exclusivos, novedades y consejos para estudiantes directamente en tu email.
        </p>
        <div class="newsletter-form">
          <input
            type="email"
            placeholder="Tu email aquí..."
            class="newsletter-input"
            id="newsletter-email"
          />
          <button class="newsletter-button" onclick={() => {
            const email = (document.getElementById('newsletter-email') as HTMLInputElement)?.value;
            if (email) {
              alert(`¡Gracias por suscribirte con ${email}! Pronto recibirás nuestras ofertas.`);
            } else {
              alert('Por favor ingresa tu email');
            }
          }}>
            Suscribirme
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="mt-12 bg-gray-50 border-t border-gray-200">
  <div class="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:py-16 lg:px-8">
    <!-- Top Section -->
    <div class="xl:grid xl:grid-cols-4 xl:gap-8">
      <!-- Brand and Description -->
      <div class="space-y-4 xl:col-span-1">
        <h2 class="text-2xl font-bold text-gray-900">📚 Librería Arco Iris</h2>
        <p class="text-gray-600">Tu tienda de confianza para todos los útiles escolares y materiales educativos con más de 10 años de experiencia.</p>
        
        <!-- Contact Info -->
        <div class="mt-4 space-y-2">
          <p class="flex items-center text-gray-600">
            <svg class="mr-2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            (011) 1234-5678
          </p>
          <p class="flex items-center text-gray-600">
            <svg class="mr-2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@libreriaarcoiris.com
          </p>
          <p class="flex items-center text-gray-600">
            <svg class="mr-2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Buenos Aires, Argentina
          </p>
        </div>

        <!-- Social Media -->
        <div class="flex mt-4 space-x-4">
          <button type="button" class="text-gray-400 hover:text-blue-600 focus:outline-none" aria-label="Visitar Facebook">
            <span class="sr-only">Facebook</span>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
            </svg>
          </button>
          <button type="button" class="text-gray-400 hover:text-pink-600 focus:outline-none" aria-label="Visitar Instagram">
            <span class="sr-only">Instagram</span>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
            </svg>
          </button>
          <button type="button" class="text-gray-400 hover:text-blue-400 focus:outline-none" aria-label="Visitar Twitter">
            <span class="sr-only">Twitter</span>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </button>
          <button type="button" class="text-gray-400 hover:text-green-600 focus:outline-none" aria-label="Visitar WhatsApp">
            <span class="sr-only">WhatsApp</span>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.147-.67.15-.197.295-.771.955-.944 1.152-.174.195-.347.21-.646.075-.3-.15-1.266-.465-2.412-1.485-.888-.795-1.484-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.136-.135.298-.354.446-.532.15-.18.198-.3.298-.496.1-.21.049-.375-.025-.523-.075-.15-.67-1.598-.922-2.191-.24-.568-.487-.494-.67-.503-.172-.007-.371-.01-.57-.01-.2 0-.524.06-.797.3-.273.24-1.04 1.006-1.04 2.456s1.07 2.85 1.218 3.045c.149.197 2.096 3.18 5.078 4.455.71.3 1.264.48 1.695.615.714.227 1.365.195 1.88.118.57-.08 1.76-.72 2.006-1.425.248-.706.248-1.312.173-1.425-.074-.12-.272-.18-.57-.33zM12 0C5.373 0 0 5.373 0 12c0 2.126.549 4.126 1.515 5.858L0 24l6.335-1.652A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.6 9.6 0 01-4.885-1.33l-.348-.208-3.622.947.967-3.51-.23-.366A9.6 9.6 0 1112 21.6z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="grid grid-cols-2 gap-8 mt-12 xl:mt-0 xl:col-span-3">
        <!-- Shopping -->
        <div class="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Comprar</h3>
            <ul class="mt-4 space-y-3">
              <li><a href="/catalogo" class="text-base text-gray-600 hover:text-indigo-600">Catálogo</a></li>
              <li><a href="/ofertas" class="text-base text-gray-600 hover:text-indigo-600">Ofertas</a></li>
              <li><a href="/novedades" class="text-base text-gray-600 hover:text-indigo-600">Novedades</a></li>
              <li><a href="/lista-utiles" class="text-base text-gray-600 hover:text-indigo-600">Lista de útiles</a></li>
              <li><a href="/sobre-nosotros" class="text-base text-gray-600 hover:text-indigo-600">Sobre Nosotros</a></li>
            </ul>
          </div>
        </div>

        <!-- Support -->
        <div class="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Soporte</h3>
            <ul class="mt-4 space-y-3">
              <li><a href="/preguntas-frecuentes" class="text-base text-gray-600 hover:text-indigo-600">Preguntas frecuentes</a></li>
              <li><a href="/envios" class="text-base text-gray-600 hover:text-indigo-600">Envíos y devoluciones</a></li>
              <li><a href="/terminos" class="text-base text-gray-600 hover:text-indigo-600">Términos y condiciones</a></li>
              <li><a href="/privacidad" class="text-base text-gray-600 hover:text-indigo-600">Políticas de privacidad</a></li>
              <li><a href="/contacto" class="text-base text-gray-600 hover:text-indigo-600">Contáctanos</a></li>
            </ul>
          </div>
        </div>

        <!-- My Account -->
        <div class="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Mi cuenta</h3>
            <ul class="mt-4 space-y-3">
              <li><a href="/mi-cuenta/pedidos" class="text-base text-gray-600 hover:text-indigo-600">Mis pedidos</a></li>
              <li><a href="/mi-cuenta/direcciones" class="text-base text-gray-600 hover:text-indigo-600">Mis direcciones</a></li>
              <li><a href="/mi-cuenta/listas" class="text-base text-gray-600 hover:text-indigo-600">Listas guardadas</a></li>
              <li><a href="/mi-cuenta/favoritos" class="text-base text-gray-600 hover:text-indigo-600">Favoritos</a></li>
              <li><a href="/mi-cuenta/configuracion" class="text-base text-gray-600 hover:text-indigo-600">Configuración</a></li>
            </ul>
          </div>
        </div>

        <!-- Store Info -->
        <div class="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h3 class="text-sm font-semibold tracking-wider text-gray-900 uppercase">Nuestra tienda</h3>
            <ul class="mt-4 space-y-3">
              <li><a href="/sucursales" class="text-base text-gray-600 hover:text-indigo-600">Sucursales</a></li>
              <li><a href="/trabaja-con-nosotros" class="text-base text-gray-600 hover:text-indigo-600">Trabajá con nosotros</a></li>
              <li><a href="/mayoristas" class="text-base text-gray-600 hover:text-indigo-600">Ventas mayoristas</a></li>
              <li><a href="/instituciones" class="text-base text-gray-600 hover:text-indigo-600">Instituciones educativas</a></li>
              <li><a href="/blog" class="text-base text-gray-600 hover:text-indigo-600">Blog</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="pt-8 mt-12 border-t border-gray-200">
      <div class="md:flex md:items-center md:justify-between">
        <p class="text-base text-center text-gray-500 md:text-left"> Librería Arco Iris. Todos los derechos reservados.</p>
        
        <div class="flex justify-center mt-4 space-x-6 text-sm text-gray-500 md:mt-0">
          <a href="/terminos" class="hover:text-gray-900">Términos y condiciones</a>
          <span>•</span>
          <a href="/privacidad" class="hover:text-gray-900">Política de privacidad</a>
          <span>•</span>
          <a href="/contacto" class="hover:text-gray-900">Contáctanos</a>
        </div>
      </div>
      
      <div class="mt-4 text-sm text-center text-gray-500">
        <p>Formas de pago: 
          <span class="inline-flex flex-wrap items-center justify-center gap-2 ml-2">
            <span class="flex items-center">
              <span class="text-green-600">✓</span> <span>Efectivo</span>
            </span>
            <span class="text-blue-500">•</span>
            <span class="flex items-center">
              <i class="text-blue-800 fab fa-cc-visa"></i>
              <i class="ml-2 text-yellow-600 fab fa-cc-mastercard"></i>
              <i class="ml-2 text-blue-500 fab fa-cc-amex"></i>
            </span>
            <span class="text-blue-500">•</span>
            <span class="flex items-center">
              <i class="text-[#00a1ea] fab fa-cc-stripe"></i>
              <span class="ml-1">Transferencias</span>
            </span>
            <span class="text-blue-500">•</span>
            <span class="flex items-center">
              <i class="text-[#00b1ea] fab fa-cc-amazon-pay"></i>
              <span class="ml-1">Mercado Pago</span>
            </span>
          </span>
        </p>
      </div>
    </div>
  </div>
</footer>
</div>

<style>
  .home-container {
    min-height: 100vh;
  }

  /* Hero Section */
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 0;
  }

  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .highlight {
    background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
  }

  .cta-button {
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    display: inline-block;
  }

  .cta-button.primary {
    background-color: white;
    color: #667eea;
  }

  .cta-button.primary:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .cta-button.secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
  }

  .cta-button.secondary:hover {
    background-color: white;
    color: #667eea;
  }

  .hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-illustration {
    position: relative;
    width: 300px;
    height: 300px;
  }

  .book-stack {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .book {
    position: absolute;
    font-size: 3rem;
    animation: float 3s ease-in-out infinite;
  }

  .book-1 {
    animation-delay: 0s;
  }

  .book-2 {
    animation-delay: 1s;
    left: 20px;
    top: -20px;
  }

  .book-3 {
    animation-delay: 2s;
    left: -20px;
    top: 20px;
  }

  .floating-elements {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .element {
    position: absolute;
    font-size: 2rem;
    animation: float 4s ease-in-out infinite;
  }

  .element-1 {
    top: 20%;
    left: 10%;
    animation-delay: 0.5s;
  }

  .element-2 {
    top: 70%;
    right: 15%;
    animation-delay: 1.5s;
  }

  .element-3 {
    bottom: 20%;
    left: 20%;
    animation-delay: 2.5s;
  }

  /* Sección de Características Mejorada */
  .features {
    padding: 4rem 0;
    background-color: #f8f9fa;
  }

  .features-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    color: #2d3748;
    margin-bottom: 3rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  .feature-card {
    background-color: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  .feature-description {
    color: #718096;
    line-height: 1.6;
  }

  /* Productos Destacados */
  .featured-products {
    padding: 4rem 0;
  }

  .featured-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
  }

  .section-subtitle {
    color: #718096;
    font-size: 1.1rem;
  }

  .view-all-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .view-all-link:hover {
    color: #5a67d8;
  }

  .featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .featured-card {
    background-color: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .featured-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  }

  .featured-image {
    height: 200px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .featured-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .featured-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .featured-icon {
    font-size: 3rem;
  }

  .featured-info {
    padding: 1.5rem;
  }

  .featured-meta {
    margin-bottom: 0.5rem;
  }

  .featured-category {
    background-color: #edf2f7;
    color: #4a5568;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .featured-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .featured-description {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .featured-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .featured-price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #38a169;
  }

  .featured-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .featured-link:hover {
    color: #5a67d8;
  }

  /* Newsletter */
  .newsletter {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 0;
  }

  .newsletter-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
  }

  .newsletter-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .newsletter-subtitle {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .newsletter-form {
    display: flex;
    max-width: 500px;
    margin: 0 auto;
    gap: 1rem;
  }

  .newsletter-input {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  .newsletter-button {
    padding: 1rem 2rem;
    background-color: white;
    color: #667eea;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .newsletter-button:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
  }

  /* Footer */
  .footer {
    background-color: #2d3748;
    color: white;
    padding: 3rem 0 1rem;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .footer-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .footer-description {
    color: #a0aec0;
    line-height: 1.6;
  }

  .footer-subtitle {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-link {
    color: #a0aec0;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-link:hover {
    color: white;
  }

  .footer-contact {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-text {
    color: #a0aec0;
  }

  .footer-bottom {
    border-top: 1px solid #4a5568;
    padding-top: 1rem;
    text-align: center;
  }

  .footer-copyright {
    color: #a0aec0;
  }

  /* Estados de carga y error */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid #e2e8f0;
    border-top: 2px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }

  .loading-text {
    color: #718096;
  }

  .error-container {
    text-align: center;
    padding: 3rem 0;
  }

  .error-title {
    color: #e53e3e;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .error-message {
    color: #718096;
    margin-bottom: 2rem;
  }

  .retry-button {
    background-color: #e53e3e;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
  }

  .retry-button:hover {
    background-color: #c53030;
  }

  /* Animaciones */
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-content {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 2rem;
    }

    .hero-title {
      font-size: 2rem;
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    .cta-button {
      width: 100%;
      max-width: 300px;
      text-align: center;
    }

    .hero-illustration {
      width: 200px;
      height: 200px;
    }

    .section-title {
      font-size: 2rem;
    }

    .section-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .featured-grid {
      grid-template-columns: 1fr;
    }

    .newsletter-form {
      flex-direction: column;
    }

    .footer-content {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  /* Responsive para sección de escaneo */
  @media (max-width: 768px) {
    .scan-content {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 2rem;
    }

    .scan-title {
      font-size: 2rem;
    }

    .scan-phone {
      width: 200px;
      height: 350px;
    }
  }

  /* Sección de Escaneo */
  .scan-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }

  .scan-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .scan-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  .scan-badge {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .scan-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #2d3748;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .scan-description {
    font-size: 1.1rem;
    color: #718096;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .scan-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .scan-feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    color: #4a5568;
  }

  .scan-feature-icon {
    font-size: 1.25rem;
  }

  .scan-button {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .scan-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  .scan-visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .scan-phone {
    width: 280px;
    height: 500px;
    background: #2d3748;
    border-radius: 2rem;
    padding: 0.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  .scan-screen {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 1.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .scan-demo {
    width: 100%;
    text-align: center;
  }

  .demo-item {
    background: #f8fafc;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    color: #4a5568;
    border-left: 3px solid #667eea;
  }

  .demo-total {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
  }
</style>
