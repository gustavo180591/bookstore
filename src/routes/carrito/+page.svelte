<script lang="ts">
  import { onMount } from 'svelte';
  import { cart, cartActions, cartItemCount, isCartEmpty } from '$lib/stores/cart';
  import CartItem from '$lib/components/CartItem.svelte';

  let loading = true;
  let error: string | null = null;

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

<div class="cart-container">
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

  <!-- Carrito vacío -->
  {#if !loading && $isCartEmpty}
    <div class="empty-cart">
      <div class="empty-cart-icon">🛒</div>
      <h2 class="empty-cart-title">Tu carrito está vacío</h2>
      <p class="empty-cart-message">
        ¡Agrega algunos productos para comenzar tu compra!
      </p>
      <a href="/catalogo" class="start-shopping-btn">
        Explorar Productos
      </a>
    </div>
  {/if}

  <!-- Carrito con productos -->
  {#if !loading && !$isCartEmpty}
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
        <h3 class="summary-title">Resumen del Pedido</h3>

        <div class="summary-breakdown">
          <div class="summary-row">
            <span class="summary-label">Subtotal:</span>
            <span class="summary-value">${cartActions.formatPrice($cart.totals.subtotal)}</span>
          </div>

          <div class="summary-row">
            <span class="summary-label">IVA (21%):</span>
            <span class="summary-value">${cartActions.formatPrice($cart.totals.tax)}</span>
          </div>

          <div class="summary-row total-row">
            <span class="summary-label">Total:</span>
            <span class="summary-value total-value">${cartActions.formatPrice($cart.totals.total)}</span>
          </div>
        </div>

        <div class="summary-actions">
          <button class="checkout-btn" onclick={handleProceedToCheckout}>
            Proceder al Pago
          </button>

          <div class="summary-info">
            <p class="shipping-info">
              🚚 Envío gratis en compras mayores a $15.000
            </p>
            <p class="payment-info">
              💳 Aceptamos tarjetas, transferencias y Mercado Pago
            </p>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
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
    text-align: center;
    padding: 4rem 2rem;
  }

  .empty-cart-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  .empty-cart-title {
    font-size: 1.875rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .empty-cart-message {
    color: #6b7280;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .start-shopping-btn {
    display: inline-block;
    padding: 1rem 2rem;
    background-color: #3b82f6;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: background-color 0.2s ease;
  }

  .start-shopping-btn:hover {
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

  .clear-cart-btn:hover {
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

  .summary-breakdown {
    margin-bottom: 2rem;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
  }

  .summary-row:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }

  .summary-label {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .summary-value {
    font-weight: 500;
    color: #1f2937;
  }

  .total-row {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .total-value {
    color: #059669;
    font-size: 1.25rem;
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

  .summary-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .shipping-info, .payment-info {
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

    .empty-cart-title {
      font-size: 1.5rem;
    }
  }
</style>
