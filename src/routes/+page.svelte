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

  <!-- Características -->
  <section class="features">
    <div class="features-container">
      <h2 class="section-title">¿Por qué elegir Bookstore?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🚚</div>
          <h3 class="feature-title">Envío Rápido</h3>
          <p class="feature-description">
            Recibe tus pedidos en 24-48 horas en CABA y alrededores. Envíos gratuitos en compras mayores a $15.000.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💳</div>
          <h3 class="feature-title">Pago Seguro</h3>
          <p class="feature-description">
            Múltiples formas de pago: tarjetas, transferencia bancaria y Mercado Pago. Todas tus transacciones protegidas.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⭐</div>
          <h3 class="feature-title">Calidad Garantizada</h3>
          <p class="feature-description">
            Trabajamos solo con las mejores marcas. Garantía de satisfacción en todos nuestros productos.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📞</div>
          <h3 class="feature-title">Atención Personalizada</h3>
          <p class="feature-description">
            Nuestro equipo está disponible para asesorarte en tu compra. ¡Estamos para ayudarte!
          </p>
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
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">📚 Bookstore</h3>
          <p class="footer-description">
            Tu librería online de confianza. Más de 10 años ofreciendo los mejores productos para estudiantes y profesionales.
          </p>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">Enlaces útiles</h4>
          <div class="footer-links">
            <a href="/catalogo" class="footer-link">Catálogo</a>
            <a href="/sobre-nosotros" class="footer-link">Sobre Nosotros</a>
            <a href="/contacto" class="footer-link">Contacto</a>
            <a href="/preguntas-frecuentes" class="footer-link">FAQ</a>
          </div>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">Contacto</h4>
          <div class="footer-contact">
            <p class="footer-text">📞 (011) 1234-5678</p>
            <p class="footer-text">📧 info@bookstore.com</p>
            <p class="footer-text">📍 Buenos Aires, Argentina</p>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copyright">
          © 2024 Bookstore. Todos los derechos reservados.
        </p>
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

  /* Características */
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
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    background-color: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
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
