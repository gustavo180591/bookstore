<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Loader2, AlertCircle, CheckCircle, User, Lock, Bell, Moon } from 'lucide-svelte';
  
  // Types
  type TabType = 'profile' | 'password' | 'notifications' | 'preferences';
  
  interface UserPreferences {
    emailNotifications: boolean;
    smsNotifications: boolean;
    darkMode: boolean;
    language: string;
    currency: string;
  }
  
  interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    preferences: UserPreferences;
    createdAt: string;
    updatedAt: string;
  }
  
  // State
  let activeTab: TabType = 'profile';
  let loading = true;
  let error: string | null = null;
  let success: string | null = null;
  
  // User data
  let user: UserProfile = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      darkMode: false,
      language: 'es',
      currency: 'COP'
    },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-10-28T00:00:00Z'
  };
  
  // Form states
  let profileForm = {
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  };
  
  let passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  let notificationForm = {
    emailNotifications: user.preferences.emailNotifications,
    smsNotifications: user.preferences.smsNotifications
  };
  
  let preferencesForm = {
    darkMode: user.preferences.darkMode,
    language: user.preferences.language,
    currency: user.preferences.currency
  };
  
  // Load user data
  onMount(async () => {
    try {
      loading = true;
      // In a real app, this would be an API call
      // const response = await fetch('/api/account/profile');
      // user = await response.json();
      loading = false;
    } catch (err) {
      console.error('Error loading user data:', err);
      error = 'Error al cargar los datos del usuario';
      loading = false;
    }
  });
  
  // Handle profile form submission
  function handleProfileSubmit() {
    // Reset messages
    error = null;
    success = null;
    
    // Basic validation
    if (!profileForm.name || !profileForm.email) {
      error = 'Por favor completa los campos obligatorios';
      return;
    }
    
    loading = true;
    setTimeout(() => {
      try {
        // In a real app, you would make an API call to update the profile
        user = {
          ...user,
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone || undefined,
          updatedAt: new Date().toISOString()
        };
        
        success = 'Perfil actualizado correctamente';
        // Clear success message after 3 seconds
        setTimeout(() => success = null, 3000);
      } catch (err) {
        console.error('Error updating profile:', err);
        error = 'Error al actualizar el perfil. Por favor inténtalo de nuevo.';
      } finally {
        loading = false;
      }
    }, 1000);
  }
  
  // Handle password change
  async function handlePasswordSubmit() {
    // Reset messages
    error = null;
    success = null;
    
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      error = 'Por favor completa todos los campos';
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      error = 'Las contraseñas no coinciden';
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }
    
    loading = true;
    try {
      // In a real app, you would make an API call to update the password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear the form
      passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      
      success = 'Contraseña actualizada correctamente';
      // Clear success message after 3 seconds
      setTimeout(() => success = null, 3000);
    } catch (err) {
      console.error('Error updating password:', err);
      error = 'Error al actualizar la contraseña. Por favor inténtalo de nuevo.';
    } finally {
      loading = false;
    }
  }
  
  // Handle notification preferences
  function handleNotificationSubmit() {
    // Save notification preferences
    loading = true;
    setTimeout(() => {
      try {
        // In a real app, you would make an API call to update the preferences
        user = {
          ...user,
          preferences: {
            ...user.preferences,
            emailNotifications: notificationForm.emailNotifications,
            smsNotifications: notificationForm.smsNotifications
          },
          updatedAt: new Date().toISOString()
        };
        
        success = 'Preferencias de notificación actualizadas';
        // Clear success message after 3 seconds
        setTimeout(() => success = null, 3000);
      } catch (err) {
        console.error('Error updating notification preferences:', err);
        error = 'Error al actualizar las preferencias de notificación. Por favor inténtalo de nuevo.';
      } finally {
        loading = false;
      }
    }, 1000);
  }
  
  // Handle preferences form submission
  function handlePreferencesSubmit() {
    // Save preferences
    loading = true;
    setTimeout(() => {
      try {
        // In a real app, you would make an API call to update the preferences
        user = {
          ...user,
          preferences: {
            ...user.preferences,
            darkMode: preferencesForm.darkMode,
            language: preferencesForm.language,
            currency: preferencesForm.currency
          },
          updatedAt: new Date().toISOString()
        };
        
        success = 'Preferencias guardadas correctamente';
        // Clear success message after 3 seconds
        setTimeout(() => success = null, 3000);
      } catch (err) {
        console.error('Error saving preferences:', err);
        error = 'Error al guardar las preferencias. Por favor inténtalo de nuevo.';
      } finally {
        loading = false;
      }
    }, 1000);
  }
</script>

<div class="px-4 py-8 mx-auto max-w-4xl sm:px-6 lg:px-8">
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-900">Configuración de la cuenta</h1>
    <p class="mt-1 text-sm text-gray-500">
      Gestiona la configuración de tu cuenta y preferencias
    </p>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <Loader2 class="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  {:else}
    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            class="py-4 px-6 text-center border-b-2 font-medium text-sm {activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => activeTab = 'profile'}
          >
            Perfil
          </button>
          <button
            class="py-4 px-6 text-center border-b-2 font-medium text-sm {activeTab === 'password' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => activeTab = 'password'}
          >
            Contraseña
          </button>
          <button
            class="py-4 px-6 text-center border-b-2 font-medium text-sm {activeTab === 'notifications' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => activeTab = 'notifications'}
          >
            Notificaciones
          </button>
          <button
            class="py-4 px-6 text-center border-b-2 font-medium text-sm {activeTab === 'preferences' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => activeTab = 'preferences'}
          >
            Preferencias
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="px-4 py-5 sm:p-6">
        {#if activeTab === 'profile'}
          <!-- Profile Tab -->
          <div class="space-y-8">
            <div class="flex items-center space-x-6">
              <div class="overflow-hidden flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full">
                {#if user.avatarUrl}
                  <img class="object-cover w-full h-full" src={user.avatarUrl} alt="User avatar" />
                {:else}
                  <User class="w-full h-full text-gray-300" />
                {/if}
              </div>
              <div>
                <h2 class="text-lg font-medium text-gray-900">Foto de perfil</h2>
                <p class="mt-1 text-sm text-gray-500">JPG, GIF o PNG. Tamaño máximo 2MB</p>
                <div class="flex mt-2 space-x-2">
                  <button
                    type="button"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cambiar
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 rounded-md border border-transparent hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <form on:submit|preventDefault={handleProfileSubmit} class="space-y-6">
              <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">Información personal</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Actualiza tu información personal aquí.
                </p>
              </div>

              {#if error}
                <div class="p-4 bg-red-50 rounded-md">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <AlertCircle class="w-5 h-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              {/if}

              {#if success}
                <div class="p-4 bg-green-50 rounded-md">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <CheckCircle class="w-5 h-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-green-800">{success}</p>
                    </div>
                  </div>
                </div>
              {/if}

              <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                <div class="sm:col-span-3">
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Nombre completo <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      id="name"
                      bind:value={profileForm.name}
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div class="sm:col-span-4">
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Correo electrónico <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      id="email"
                      type="email"
                      bind:value={profileForm.email}
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label for="phone" class="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <div class="mt-1">
                    <input
                      type="tel"
                      id="phone"
                      bind:value={profileForm.phone}
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div class="pt-5">
                <div class="flex justify-end">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {#if loading}
                      <Loader2 class="mr-2 -ml-1 w-4 h-4 animate-spin" />
                    {/if}
                    Guardar cambios
                  </button>
                </div>
              </div>
            </form>
          </div>

        {:else if activeTab === 'password'}
          <!-- Password Tab -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Cambiar contraseña</h3>
              <p class="mt-1 text-sm text-gray-500">
                Actualiza tu contraseña aquí.
              </p>
            </div>

            {#if error}
              <div class="p-4 bg-red-50 rounded-md">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <AlertCircle class="w-5 h-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            {/if}

            {#if success}
              <div class="p-4 bg-green-50 rounded-md">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <CheckCircle class="w-5 h-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            {/if}

            <form on:submit|preventDefault={handlePasswordSubmit} class="space-y-6">
              <div class="space-y-6">
                <div>
                  <label for="current-password" class="block text-sm font-medium text-gray-700">
                    Contraseña actual
                  </label>
                  <div class="mt-1">
                    <input
                      id="current-password"
                      type="password"
                      bind:value={passwordForm.currentPassword}
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label for="new-password" class="block text-sm font-medium text-gray-700">
                    Nueva contraseña
                  </label>
                  <div class="mt-1">
                    <input
                      id="new-password"
                      type="password"
                      bind:value={passwordForm.newPassword}
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                    Confirmar nueva contraseña
                  </label>
                  <div class="mt-1">
                    <input
                      id="confirm-password"
                      type="password"
                      bind:value={passwordForm.confirmPassword}
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div class="pt-5">
                <div class="flex justify-end">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {#if loading}
                      <Loader2 class="mr-2 -ml-1 w-4 h-4 animate-spin" />
                    {/if}
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </form>
          </div>

        {:else if activeTab === 'notifications'}
          <!-- Notifications Tab -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Preferencias de notificaciones</h3>
              <p class="mt-1 text-sm text-gray-500">
                Configura cómo recibes notificaciones.
              </p>
            </div>

            {#if error}
              <div class="p-4 bg-red-50 rounded-md">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <AlertCircle class="w-5 h-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            {/if}

            {#if success}
              <div class="p-4 bg-green-50 rounded-md">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <CheckCircle class="w-5 h-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            {/if}

            <form on:submit|preventDefault={handleNotificationSubmit} class="space-y-6">
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      bind:checked={notificationForm.emailNotifications}
                      class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="email-notifications" class="font-medium text-gray-700">
                      Notificaciones por correo electrónico
                    </label>
                    <p class="text-gray-500">Recibe notificaciones importantes por correo electrónico.</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="sms-notifications"
                      type="checkbox"
                      bind:checked={notificationForm.smsNotifications}
                      class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="sms-notifications" class="font-medium text-gray-700">
                      Notificaciones por SMS
                    </label>
                    <p class="text-gray-500">Recibe notificaciones importantes por mensaje de texto.</p>
                  </div>
                </div>
              </div>

              <div class="pt-5">
                <div class="flex justify-end">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {#if loading}
                      <Loader2 class="mr-2 -ml-1 w-4 h-4 animate-spin" />
                    {/if}
                    Guardar preferencias
                  </button>
                </div>
              </div>
            </form>
          </div>

        {:else if activeTab === 'preferences'}
          <!-- Preferences Tab -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Preferencias de la cuenta</h3>
              <p class="mt-1 text-sm text-gray-500">
                Personaliza cómo se comporta la aplicación.
              </p>
            </div>

            {#if error}
              <div class="p-4 bg-red-50 rounded-md">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <AlertCircle class="w-5 h-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            {/if}

            {#if success}
              <div class="p-4 bg-green-50 rounded-md">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <CheckCircle class="w-5 h-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            {/if}

            <form on:submit|preventDefault={handlePreferencesSubmit} class="space-y-6">
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="dark-mode"
                      type="checkbox"
                      bind:checked={preferencesForm.darkMode}
                      class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="dark-mode" class="font-medium text-gray-700">
                      Modo oscuro
                    </label>
                    <p class="text-gray-500">Habilita el modo oscuro para una mejor experiencia visual en condiciones de poca luz.</p>
                  </div>
                </div>

                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="language" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Idioma
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      id="language"
                      bind:value={preferencesForm.language}
                      class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                </div>

                <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="currency" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Moneda
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      id="currency"
                      bind:value={preferencesForm.currency}
                      class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm"
                    >
                      <option value="COP">Peso Colombiano (COP)</option>
                      <option value="USD">Dólar Estadounidense (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="BRL">Real Brasileño (BRL)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="pt-5">
                <div class="flex justify-end">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {#if loading}
                      <Loader2 class="mr-2 -ml-1 w-4 h-4 animate-spin" />
                    {/if}
                    Guardar preferencias
                  </button>
                </div>
              </div>
            </form>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>