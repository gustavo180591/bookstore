<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { cartActions } from '$lib/stores/cart';
  import type { CartItem as CartItemType } from '$lib/stores/cart';

  interface Props {
    item: CartItemType;
  }

  let { item }: Props = $props();

  const dispatch = createEventDispatcher<{
    remove: void;
    updateQuantity: number;
  }>();

  let updating = $state(false);

  function handleQuantityChange(newQuantity: number) {
    if (newQuantity <= 0) {
      dispatch('remove');
      return;
    }

    if (newQuantity > item.product.stock) {
      alert(`Stock máximo disponible: ${item.product.stock}`);
      return;
    }

    dispatch('updateQuantity', newQuantity);
  }

  function handleRemove() {
    if (confirm('¿Estás seguro de que quieres remover este producto del carrito?')) {
      dispatch('remove');
    }
  }

  function incrementQuantity() {
    if (item.quantity < item.product.stock) {
      handleQuantityChange(item.quantity + 1);
    } else {
      alert(`Stock máximo disponible: ${item.product.stock}`);
    }
  }

  function decrementQuantity() {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    } else {
      handleRemove();
    }
  }
</script>

<div class="cart-item">
  <!-- Información del producto -->
  <div class="item-info">
    <div class="item-image">
      {#if item.product.imageUrl}
        <img src={item.product.imageUrl} alt={item.product.name} class="product-image" />
      {:else}
        <div class="product-placeholder">
          <span class="placeholder-icon">📚</span>
        </div>
      {/if}
    </div>

    <div class="item-details">
      <h3 class="item-name">{item.product.name}</h3>

      {#if item.product.category}
        <span class="item-category">{item.product.category}</span>
      {/if}

      {#if !item.product.isActive}
        <span class="item-unavailable">No disponible</span>
      {/if}

      <div class="item-actions">
        <div class="quantity-controls">
          <button
            class="quantity-btn"
            onclick={decrementQuantity}
            disabled={updating || item.quantity <= 1}
            aria-label="Disminuir cantidad"
          >
            −
          </button>

          <span class="quantity-display">{item.quantity}</span>

          <button
            class="quantity-btn"
            onclick={incrementQuantity}
            disabled={updating || item.quantity >= item.product.stock || !item.product.isActive}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button class="remove-btn" onclick={handleRemove} disabled={updating}>
          🗑️ Remover
        </button>
      </div>
    </div>
  </div>

  <!-- Precio y total -->
  <div class="item-pricing">
    <div class="price-info">
      <span class="unit-price">
        {cartActions.formatPrice(item.product.price)}
      </span>

      {#if item.quantity > 1}
        <span class="quantity-info">
          × {item.quantity} = {cartActions.formatPrice((parseFloat(item.product.price) * item.quantity).toString())}
        </span>
      {/if}
    </div>

    {#if item.product.stock < 5 && item.product.stock > 0}
      <span class="stock-warning">
        ¡Últimas {item.product.stock} unidades!
      </span>
    {/if}

    {#if item.product.stock === 0}
      <span class="out-of-stock">
        Agotado
      </span>
    {/if}
  </div>
</div>

<style>
  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    background-color: white;
    transition: all 0.2s ease;
  }

  .cart-item:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .item-info {
    display: flex;
    gap: 1rem;
    flex: 1;
  }

  .item-image {
    width: 80px;
    height: 80px;
    border-radius: 0.5rem;
    overflow: hidden;
    flex-shrink: 0;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder-icon {
    font-size: 1.5rem;
  }

  .item-details {
    flex: 1;
  }

  .item-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  .item-category {
    display: inline-block;
    background-color: #dbeafe;
    color: #1e40af;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }

  .item-unavailable {
    display: inline-block;
    background-color: #fee2e2;
    color: #dc2626;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 0.25rem;
  }

  .quantity-btn {
    width: 2rem;
    height: 2rem;
    border: none;
    background-color: white;
    border-radius: 0.375rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .quantity-btn:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  .quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .quantity-display {
    min-width: 2rem;
    text-align: center;
    font-weight: 600;
    color: #1f2937;
  }

  .remove-btn {
    padding: 0.5rem 1rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .remove-btn:hover:not(:disabled) {
    background-color: #dc2626;
  }

  .remove-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .item-pricing {
    text-align: right;
    min-width: 120px;
  }

  .price-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .unit-price {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
  }

  .quantity-info {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .stock-warning {
    display: block;
    font-size: 0.75rem;
    color: #d97706;
    font-weight: 500;
    margin-top: 0.5rem;
  }

  .out-of-stock {
    display: block;
    font-size: 0.75rem;
    color: #dc2626;
    font-weight: 500;
    margin-top: 0.5rem;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .cart-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .item-info {
      width: 100%;
    }

    .item-pricing {
      width: 100%;
      text-align: left;
      border-top: 1px solid #f3f4f6;
      padding-top: 1rem;
    }

    .item-actions {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      gap: 0.75rem;
    }

    .quantity-controls {
      align-self: flex-start;
    }
  }
</style>
