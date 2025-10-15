<script lang="ts">
  import { onMount } from 'svelte';

  let formData = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    documentType: 'DNI',
    documentNumber: '',
    phone: ''
  };

  let loading = false;
  let error: string | null = null;
  let success = false;
  let redirectTo = '';

  // Obtener URL de redirección
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    redirectTo = urlParams.get('redirect') || '/catalogo';
  });

  async function handleRegister(event: Event) {
    event.preventDefault();

    // Validar campos requeridos
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.documentNumber) {
      error = 'Por favor completa todos los campos marcados con *';
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      error = 'Formato de email inválido';
      return;
    }

    // Validar contraseña
    if (formData.password.length < 6) {
      error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      error = 'Las contraseñas no coinciden';
      return;
    }

    loading = true;
    error = null;
    success = false;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          documentType: formData.documentType,
          documentNumber: formData.documentNumber,
          phone: formData.phone || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        success = true;
        // Limpiar formulario
        formData = {
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          documentType: 'DNI',
          documentNumber: '',
          phone: ''
        };
      } else {
        error = data.error || 'Error al registrar usuario';
      }
    } catch (err) {
      console.error('Error en registro:', err);
      error = 'Error interno del servidor';
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleRegister(event);
    }
  }
</script>

<svelte:head>
  <title>Registrarse - Bookstore</title>
  <meta name="description" content="Crea tu cuenta en Bookstore para acceder al carrito y realizar compras" />
</svelte:head>

<div class="register-container">
  <div class="register-card">
    <div class="register-header">
      <h1 class="register-title">📝 Crear Cuenta</h1>
      <p class="register-subtitle">
        Regístrate para acceder al carrito y realizar compras
      </p>
    </div>

    <!-- Success message -->
    {#if success}
      <div class="success-banner">
        <div class="success-content">
          <span class="success-icon">✅</span>
          <div class="success-message">
            <h3>¡Registro exitoso!</h3>
            <p>Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.</p>
            <a href="/auth/login" class="login-link">
              Ir a iniciar sesión →
            </a>
          </div>
        </div>
      </div>
    {/if}

    <!-- Error message -->
    {#if error && !success}
      <div class="error-banner">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span class="error-message">{error}</span>
          <button class="error-close" onclick={() => error = null}>×</button>
        </div>
      </div>
    {/if}

    <!-- Registration form -->
    {#if !success}
      <form class="register-form" onsubmit={handleRegister}>
        <!-- Información personal -->
        <div class="form-section">
          <h3 class="section-title">Información Personal</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">
                Nombre *
              </label>
              <input
                type="text"
                id="firstName"
                class="form-input"
                placeholder="Tu nombre"
                bind:value={formData.firstName}
                onkeypress={handleKeyPress}
                required
              />
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">
                Apellido *
              </label>
              <input
                type="text"
                id="lastName"
                class="form-input"
                placeholder="Tu apellido"
                bind:value={formData.lastName}
                onkeypress={handleKeyPress}
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="documentType" class="form-label">
                Tipo de Documento *
              </label>
              <select
                id="documentType"
                class="form-select"
                bind:value={formData.documentType}
                required
              >
                <option value="DNI">DNI</option>
                <option value="CUIL">CUIL</option>
                <option value="CUIT">CUIT</option>
              </select>
            </div>

            <div class="form-group">
              <label for="documentNumber" class="form-label">
                Número de Documento *
              </label>
              <input
                type="text"
                id="documentNumber"
                class="form-input"
                placeholder="12345678"
                bind:value={formData.documentNumber}
                onkeypress={handleKeyPress}
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              class="form-input"
              placeholder="+54 11 1234-5678"
              bind:value={formData.phone}
              onkeypress={handleKeyPress}
            />
          </div>
        </div>

        <!-- Información de cuenta -->
        <div class="form-section">
          <h3 class="section-title">Información de Cuenta</h3>

          <div class="form-group">
            <label for="email" class="form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              class="form-input"
              placeholder="tu@email.com"
              bind:value={formData.email}
              onkeypress={handleKeyPress}
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password" class="form-label">
                Contraseña *
              </label>
              <input
                type="password"
                id="password"
                class="form-input"
                placeholder="••••••••"
                bind:value={formData.password}
                onkeypress={handleKeyPress}
                required
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                id="confirmPassword"
                class="form-input"
                placeholder="••••••••"
                bind:value={formData.confirmPassword}
                onkeypress={handleKeyPress}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="register-button"
          disabled={loading}
        >
          {#if loading}
            <div class="loading-spinner"></div>
            <span>Creando cuenta...</span>
          {:else}
            <span>Crear Cuenta</span>
          {/if}
        </button>
      </form>
    {/if}

    <div class="register-footer">
      <p class="register-info">
        ¿Ya tienes cuenta?
        <a href="/auth/login" class="login-link">
          Inicia sesión aquí
        </a>
      </p>
    </div>
  </div>
</div>

<style>
  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
  }

  .register-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
  }

  .register-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .register-title {
    font-size: 1.875rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .register-subtitle {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .success-banner {
    background-color: #d1fae5;
    border: 1px solid #a7f3d0;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .success-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .success-icon {
    color: #059669;
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .success-message h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #065f46;
    margin-bottom: 0.5rem;
  }

  .success-message p {
    color: #047857;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .login-link {
    color: #059669;
    text-decoration: none;
    font-weight: 500;
  }

  .login-link:hover {
    color: #047857;
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

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-section {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
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

  .form-input, .form-select {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .register-button {
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

  .register-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .register-button:disabled {
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

  .register-footer {
    margin-top: 2rem;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    padding-top: 1.5rem;
  }

  .register-info {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .login-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
  }

  .login-link:hover {
    color: #5a67d8;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .register-container {
      padding: 0.5rem;
    }

    .register-card {
      padding: 1.5rem;
    }

    .register-title {
      font-size: 1.5rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .form-section {
      padding: 1rem;
    }
  }
</style>
