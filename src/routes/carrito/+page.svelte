<script lang="ts">
  import { onMount } from 'svelte';
  import { cart, cartActions, cartItemCount, isCartEmpty } from '$lib/stores/cart';
  import CartItem from '$lib/components/CartItem.svelte';

  let loading = $state(true);
  let error = $state<string | null>(null);
  let updatingItem = $state<string | null>(null);

  // Cargar carrito al montar el componente
  onMount(async () => {
    const result = await cartActions.loadCart();

    if (result.needsAuth) {
      // Usuario no autenticado, redirigir al login
      alert('Debes iniciar sesión para acceder al carrito');
      window.location.href = '/auth/login';
      return;
    }

    loading = false;

    if (!result.success) {
      error = result.error || 'Error al cargar el carrito';
      setTimeout(() => error = null, 3000);
    }
  });

  async function handleRemoveItem(itemId: string) {
    const result = await cartActions.removeFromCart(itemId);

    if (result.needsAuth) {
      alert(result.error || 'Debes iniciar sesión para modificar el carrito');
      window.location.href = '/auth/login';
      return;
    }

    if (!result.success) {
      error = result.error || 'Error removiendo producto';
      setTimeout(() => error = null, 3000);
    }
  }

  async function handleUpdateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }

    try {
      updatingItem = itemId;
      const result = await cartActions.updateQuantity(itemId, quantity);

      if (result.needsAuth) {
        alert(result.error || 'Debes iniciar sesión para modificar el carrito');
        window.location.href = '/auth/login';
        return;
      }

      if (!result.success) {
        error = result.error || 'Error actualizando cantidad';
        setTimeout(() => error = null, 3000);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      error = 'Error al actualizar la cantidad';
      setTimeout(() => error = null, 3000);
    } finally {
      updatingItem = null;
    }
  }

  async function handleClearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      const result = await cartActions.clearCart();

      if (result.needsAuth) {
        alert(result.error || 'Debes iniciar sesión para vaciar el carrito');
        window.location.href = '/auth/login';
        return;
      }

      if (!result.success) {
        error = result.error || 'Error vaciando carrito';
        setTimeout(() => error = null, 3000);
      }
    }
  }

  function handleContinueShopping() {
    window.location.href = '/catalogo';
  }

  function handleProceedToCheckout() {
    // TODO: Implementar checkout
    alert('Funcionalidad de checkout próximamente disponible');
  }
</script>

<svelte:head>
  <title>Carrito de Compras - Bookstore</title>
  <meta name="description" content="Revisa y gestiona los productos en tu carrito de compras" />
</svelte:head>

{#if error}
  <div class="notification error">
    {error}
  </div>
{/if}

<div class="cart-container">
  {#if loading}
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Cargando carrito...</p>
    </div>
  {:else if $isCartEmpty}
    <div class="empty-cart">
      <div class="empty-cart-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-cart-icon">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h2>¡Tu carrito está vacío!</h2>
        <p>Parece que aún no has agregado ningún producto a tu carrito.</p>
        <a href="/catalogo" class="browse-products-btn">
          Ver productos disponibles
        </a>
      </div>
    </div>
  {:else}
    <!-- Header -->
    <div class="cart-header">
      <h1 class="cart-title">🛒 Carrito de Compras</h1>
      <div class="cart-navigation">
        <a href="/catalogo" class="continue-shopping-btn">
          ← Continuar Comprando
        </a>
      </div>
    </div>

    <!-- Estado de carga -->
    {#if loading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <span class="loading-text">Cargando carrito...</span>
      </div>
    {/if}

    <!-- Estado de error -->
    {#if error}
      <div class="error-banner">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span class="error-message">{error}</span>
          <button class="error-close" onclick={() => error = null}>×</button>
        </div>
      </div>
    {/if}

    <!-- Carrito con productos -->
    <div class="cart-content">
      <!-- Lista de productos -->
      <div class="cart-items">
        <div class="cart-items-header">
          <h2 class="items-title">Productos en tu carrito</h2>
          {#if $cartItemCount > 0}
            <span class="items-count">{$cartItemCount} productos</span>
          {/if}
        </div>

        <div class="items-list">
          {#each $cart.items as item (item.id)}
            <CartItem
              {item}
              on:remove={() => handleRemoveItem(item.id)}
              on:updateQuantity={(event) => handleUpdateQuantity(item.id, event.detail)}
            />
          {/each}
        </div>

        <!-- Acciones del carrito -->
        <div class="cart-actions">
          <button class="clear-cart-btn" onclick={handleClearCart}>
            Vaciar Carrito
          </button>
        </div>
      </div>

      <!-- Resumen del pedido -->
      <div class="cart-summary">
        <h2 class="summary-title">Resumen del Pedido</h2>
        <div class="summary-rows">
          <div>
            <span>Subtotal ({$cart.items.reduce((acc, item) => acc + item.quantity, 0)} productos)</span>
            <span>${$cart.totals.subtotal}</span>
          </div>
          <div>
            <span>Envío</span>
            <span>Se calcula al finalizar</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>${$cart.totals.total}</span>
          </div>
        </div>
        <div class="summary-footer">
          <p>Envío gratuito a todo el país</p>
          <p>Pago seguro con múltiples opciones</p>
        </div>
        <div class="summary-actions">
          <button
            class="checkout-btn"
            disabled={$isCartEmpty || loading}
            onclick={handleProceedToCheckout}
          >
            {#if loading}
              Procesando...
            {:else}
              Proceder al Pago
            {/if}
          </button>
          {#if !$isCartEmpty}
            <button
              class="clear-cart-btn"
              disabled={loading}
              onclick={handleClearCart}
            >
              Vaciar Carrito
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Estilos de notificación */
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  }
  
  .error {
    background-color: #ef4444;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .cart-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 100vh;
  }

  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .cart-title {
    font-size: 2rem;
    font-weight: bold;
    color: #1f2937;
    margin: 0;
  }

  .cart-navigation {
    display: flex;
    gap: 1rem;
  }

  .continue-shopping-btn {
    padding: 0.75rem 1.5rem;
    background-color: #f3f4f6;
    color: #374151;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .continue-shopping-btn:hover {
    background-color: #e5e7eb;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }

  .loading-text {
    color: #6b7280;
    font-size: 1.1rem;
  }

  .error-banner {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .error-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .error-icon {
    color: #dc2626;
    font-size: 1.25rem;
  }

  .error-message {
    color: #991b1b;
    flex: 1;
  }

  .error-close {
    background: none;
    border: none;
    color: #991b1b;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-cart {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    padding: 2rem;
    text-align: center;
  }

  .empty-cart-content {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 0.5rem;
    background-color: #f9fafb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .empty-cart-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 1.5rem;
    color: #9ca3af;
  }

  .empty-cart h2 {
    font-size: 1.5rem;
    font-size: 1.875rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .empty-cart p {
    color: #6b7280;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .empty-cart a {
    display: inline-block;
    padding: 1rem 2rem;
    background-color: #3b82f6;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: background-color 0.2s ease;
  }

  .empty-cart a:hover {
    background-color: #2563eb;
  }

  .cart-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }

  .cart-items {
    background-color: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .cart-items-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .items-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .items-count {
    background-color: #dbeafe;
    color: #1e40af;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .cart-actions {
    display: flex;
    justify-content: flex-end;
  }

  .clear-cart-btn {
    padding: 0.75rem 1.5rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .clear-cart-btn:hover:not(:disabled) {
    background-color: #dc2626;
  }

  .cart-summary {
    background-color: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    height: fit-content;
  }

  .summary-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  .summary-rows {
    margin-bottom: 2rem;
  }

  .summary-rows > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
  }

  .summary-rows > div:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }

  .summary-rows span:first-child {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .summary-rows span:last-child {
    font-weight: 500;
    color: #1f2937;
  }

  .summary-rows .total {
    font-size: 1.125rem;
    font-weight: 600;
  }


  .summary-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .checkout-btn {
    width: 100%;
    padding: 1rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .checkout-btn:hover {
    background-color: #059669;
  }

  .summary-footer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .summary-footer p {
    margin: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .cart-container {
      padding: 1rem;
    }

    .cart-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .cart-title {
      font-size: 1.5rem;
    }

    .cart-content {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .empty-cart {
      padding: 2rem 1rem;
    }

    .empty-cart-icon {
      font-size: 3rem;
    }

    .empty-cart h2 {
      font-size: 1.5rem;
    }
  }
</style>
