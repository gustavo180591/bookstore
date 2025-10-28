<script lang="ts">
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let loading = false;
  let error: string | null = null;
  let redirectTo = '';

  // Obtener URL de redirección
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    redirectTo = urlParams.get('redirect') || 'http://localhost:5174/';
  });

  async function handleLogin(event: Event) {
    event.preventDefault();

    if (!email || !password) {
      error = 'Por favor completa todos los campos';
      return;
    }

    loading = true;
    error = null;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir al usuario después de inicio de sesión exitoso
        window.location.href = redirectTo;
      } else {
        error = data.error || 'Error al iniciar sesión';
      }
    } catch (err) {
      console.error('Error en login:', err);
      error = 'Error interno del servidor';
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleLogin(event);
    }
  }
</script>

<svelte:head>
  <title>Iniciar Sesión - Bookstore</title>
  <meta name="description" content="Inicia sesión en tu cuenta de Bookstore para acceder al carrito y realizar compras" />
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <h1 class="login-title">🔐 Iniciar Sesión</h1>
      <p class="login-subtitle">
        Accede a tu cuenta para gestionar tu carrito y realizar compras
      </p>
    </div>

    <!-- Error message -->
    {#if error}
      <div class="error-banner">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span class="error-message">{error}</span>
          <button class="error-close" onclick={() => error = null}>×</button>
        </div>
      </div>
    {/if}

    <form class="login-form" onsubmit={handleLogin}>
      <div class="form-group">
        <label for="email" class="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          class="form-input"
          placeholder="tu@email.com"
          bind:value={email}
          onkeypress={handleKeyPress}
          required
        />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          class="form-input"
          placeholder="••••••••"
          bind:value={password}
          onkeypress={handleKeyPress}
          required
        />
      </div>

      <button
        type="submit"
        class="login-button"
        disabled={loading || !email || !password}
      >
        {#if loading}
          <div class="loading-spinner"></div>
          <span>Iniciando sesión...</span>
        {:else}
          <span>Iniciar Sesión</span>
        {/if}
      </button>
    </form>

    <div class="login-footer">
      <p class="login-info">
        ¿No tienes cuenta?
        <a href="/auth/register" class="register-link">
          Regístrate aquí
        </a>
      </p>

      <div class="demo-credentials">
        <p class="demo-title">🔑 Credenciales de prueba:</p>
        <div class="demo-cred">
          <strong>Email:</strong> test@bookstore.com<br>
          <strong>Contraseña:</strong> password
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
  }

  .login-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-title {
    font-size: 1.875rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .login-subtitle {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .error-banner {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .error-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .error-icon {
    color: #dc2626;
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .error-message {
    color: #991b1b;
    flex: 1;
    font-size: 0.875rem;
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

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .form-input {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .login-button {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 3rem;
  }

  .login-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .login-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .login-footer {
    margin-top: 2rem;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    padding-top: 1.5rem;
  }

  .login-info {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .register-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
  }

  .register-link:hover {
    color: #5a67d8;
  }

  .demo-credentials {
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
  }

  .demo-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .demo-cred {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .demo-cred strong {
    color: #374151;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive */
  @media (max-width: 480px) {
    .login-container {
      padding: 0.5rem;
    }

    .login-card {
      padding: 1.5rem;
    }

    .login-title {
      font-size: 1.5rem;
    }
  }
</style>
