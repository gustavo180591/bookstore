<script lang="ts">
  import { page } from '$app/stores';
  import { cartItemCount } from '$lib/stores/cart';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { User } from '$lib/types';
  
  // Estado de los menús desplegables
  let isProfileMenuOpen = false;
  let isUtilsMenuOpen = false;
  let user: User | null = null;
  
  // Verificar si el usuario está autenticado al cargar el componente
  onMount(async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        user = await response.json();
      }
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
    }
  });
  
  // Cerrar sesión
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Lista de Útiles', href: '/lista-utiles' },
    { name: 'Blog', href: '/blog' },
    { name: 'Soporte', href: '/soporte' },
  ];
  
  const isActive = (path: string) => {
    return $page.url.pathname === path;
  };
  
  // Manejar eventos de teclado para accesibilidad
  const handleKeyDown = (event: KeyboardEvent, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.location.href = href;
    }
  };
  
  // Cerrar menús al hacer clic fuera de ellos
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-profile-menu]')) {
      isProfileMenuOpen = false;
    }
    if (!target.closest('[data-utils-menu]')) {
      isUtilsMenuOpen = false;
    }
  };
  
  // Handle click outside for mobile menu
  let cleanup: (() => void) | null = null;
  
  $: {
    // Clean up previous listener if it exists
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    
    if (isProfileMenuOpen || isUtilsMenuOpen) {
      const handleDocumentClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-navigation]')) {
          isProfileMenuOpen = false;
          isUtilsMenuOpen = false;
        }
      };
      
      document.addEventListener('click', handleDocumentClick);
      
      // Store cleanup function
      cleanup = () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }
  }
</script>

<header class="bg-white shadow-sm">
  <div class="relative" data-navigation>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-xl font-bold text-indigo-600">Librería Arco Iris</a>
        </div>
        <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
          {#each navItems as item}
            {#if item.href === '/lista-utiles'}
              <div class="relative" data-utils-menu>
                <button
                  on:click={() => isUtilsMenuOpen = !isUtilsMenuOpen}
                  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (isUtilsMenuOpen = !isUtilsMenuOpen, e.preventDefault())}
                  class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 {isActive(item.href) 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                  aria-expanded={isUtilsMenuOpen}
                  aria-haspopup="true"
                >
                  {item.name}
                  <span class="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                    Nuevo
                  </span>
                  <svg class="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>

                {#if isUtilsMenuOpen}
                  <div class="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div class="py-1" role="none">
                      <a
                        href="/lista-utiles"
                        class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        tabindex="-1"
                      >
                        <div class="flex items-center">
                          <svg class="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Escanear lista
                        </div>
                        <p class="text-xs text-gray-500 ml-7 mt-1">Sube una imagen o PDF de tu lista</p>
                      </a>
                      <a
                        href="/lista-utiles/crear"
                        class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        tabindex="-1"
                      >
                        <div class="flex items-center">
                          <svg class="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Crear lista manual
                        </div>
                        <p class="text-xs text-gray-500 ml-7 mt-1">Agrega productos uno por uno</p>
                      </a>
                      <a
                        href="/lista-utiles/ejemplo"
                        class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        tabindex="-1"
                      >
                        <div class="flex items-center">
                          <svg class="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Ver lista de ejemplo
                        </div>
                        <p class="text-xs text-gray-500 ml-7 mt-1">Mira cómo funciona</p>
                      </a>
                    </div>
                  </div>
                {/if}
              </div>
            {:else}
              <a
                href={item.href}
                on:keydown={(e) => handleKeyDown(e, item.href)}
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 {isActive(item.href) 
                  ? 'border-indigo-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                tabindex="0"
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.name}
              </a>
            {/if}
          {/each}
        </nav>
      </div>
      
      <div class="flex items-center space-x-4">

        {#if user}
          <!-- Menú de perfil -->
          <div class="ml-4 relative" data-profile-menu>
            <button
              type="button"
              class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              id="user-menu-button"
              on:click={() => isProfileMenuOpen = !isProfileMenuOpen}
              on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (isProfileMenuOpen = !isProfileMenuOpen, e.preventDefault())}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
            >
              <span class="sr-only">Abrir menú de usuario</span>
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>

            {#if isProfileMenuOpen}
              <div 
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <a 
                  href="/perfil" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.location.href = '/perfil';
                    }
                  }}
                >
                  Mi perfil
                </a>
                <a 
                  href="/mis-pedidos" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.location.href = '/mis-pedidos';
                    }
                  }}
                >
                  Mis pedidos
                </a>
                <button
                  type="button"
                  on:click={handleLogout}
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLogout();
                    }
                  }}
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                >
                  Cerrar sesión
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <!-- Botones de inicio de sesión/registro -->
          <div class="hidden md:flex items-center space-x-4">
            <a 
              href="/auth/login" 
              class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Iniciar sesión
            </a>
            <a 
              href="/auth/register" 
              class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Registrarse
            </a>
          </div>
        {/if}
      </div>
    </div>
    </div> <!-- Close max-w-7xl -->
  </div> <!-- Close relative -->
  
  <!-- Mobile menu -->
  <div class="sm:hidden">
    <div class="pt-2 pb-3 space-y-1">
      {#each navItems as item}
        <a
          href={item.href}
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isActive(item.href)
            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}"
        >
          {item.name}
          {#if item.href === '/lista-utiles'}
            <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
              Nuevo
            </span>
          {/if}
        </a>
      {/each}
    </div>
  </div>
</header>
