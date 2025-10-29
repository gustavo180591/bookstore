<!-- 
  Navigation Component - Main navigation bar for the bookstore application
  
  Features:
  - Responsive navigation with mobile menu
  - User authentication state management
  - Shopping cart integration
  - Dropdown menus for utilities and user profile
  - Accessibility support (keyboard navigation, ARIA attributes)
  - Clean code practices with constants and well-documented functions
  
  @author Bookstore Development Team
  @version 2.0.0
-->

<script lang="ts">
  import { page } from '$app/stores';
  import { cartItemCount } from '$lib/stores/cart';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { fade, slide, scale } from 'svelte/transition';
  import type { User } from '$lib/types';

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  /** Navigation configuration */
  const NAVIGATION_ITEMS = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Lista de Útiles', href: '/lista-utiles' },
    { name: 'Blog', href: '/blog' },
    { name: 'Soporte', href: '/soporte' },
  ] as const;

  /** API endpoints */
  const API_ENDPOINTS = {
    SESSION: '/api/auth/session',
    LOGOUT: '/api/auth/logout',
  } as const;

  /** Auth routes */
  const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/perfil',
    ORDERS: '/mi-cuenta',
  } as const;

  /** Shopping routes */
  const SHOPPING_ROUTES = {
    CART: '/carrito',
    CATALOG: '/catalogo',
  } as const;

  /** Enhanced CSS Classes - Modern navigation styles */
  const NAVIGATION_BASE_CLASSES = 'inline-flex items-center px-3 py-2 mt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out';

  /** CSS Classes - Active navigation state */
  const NAVIGATION_ACTIVE_CLASSES = 'border-indigo-500 text-gray-900 bg-indigo-50/50';

  /** CSS Classes - Inactive navigation state */
  const NAVIGATION_INACTIVE_CLASSES = 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50/50';

  /** Enhanced CSS Classes - Button styles */
  const BUTTON_STYLES = {
    PRIMARY: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105',
    SECONDARY: 'text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-50 rounded-lg transition-all duration-200 ease-in-out',
    MOBILE: 'block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-all duration-200 ease-in-out',
    CART: 'text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium flex items-center hover:bg-indigo-50 rounded-lg transition-all duration-200 ease-in-out',
  } as const;

  /** Enhanced CSS Classes - Dropdown menu styles */
  const DROPDOWN_STYLES = {
    CONTAINER: 'origin-top-left absolute left-0 mt-3 w-64 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm border border-gray-200/50 ring-1 ring-black/5 focus:outline-none z-50',
    ITEM: 'text-gray-700 block px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all duration-200 ease-in-out first:rounded-t-xl last:rounded-b-xl',
    ARROW: 'ml-2 h-4 w-4 transition-transform duration-200 ease-in-out',
  } as const;

  /** Enhanced CSS Classes - Loading and feedback styles */
  const FEEDBACK_STYLES = {
    LOADING_SPINNER: 'animate-spin rounded-full border-b-2 border-indigo-600',
    AVATAR_LOADING: 'h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center',
    AVATAR_USER: 'h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-semibold text-sm shadow-sm',
    CART_BADGE: 'ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm',
  } as const;

  // ============================================================================
  // TYPES
  // ============================================================================

  /** Navigation item type */
  type NavigationItem = typeof NAVIGATION_ITEMS[number];

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /** Controls the profile dropdown menu visibility */
  let isProfileMenuOpen = false;

  /** Controls the utilities dropdown menu visibility */
  let isUtilsMenuOpen = false;
  
  /** Reference to the dropdown menu element */
  let dropdownMenu: HTMLElement;

  /** Current authenticated user or null if not authenticated */
  let currentUser: User | null = null;

  /** Loading state for session operations */
  let isSessionLoading = true;

  /** Loading state for logout operation */
  let isLogoutLoading = false;

  /** Notification message for user feedback */
  let notificationMessage = '';

  /** Cleanup function for event listeners */
  let eventListenerCleanup: (() => void) | null = null;

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Shows a temporary notification message to the user
   * @param message - The message to display
   * @param duration - How long to show the message (default: 3000ms)
   */
  const showNotification = (message: string, duration: number = 3000): void => {
    notificationMessage = message;
    setTimeout(() => {
      notificationMessage = '';
    }, duration);
  };

  /**
   * Checks if a navigation path is currently active
   * @param path - The path to check
   * @returns true if the path matches the current page URL
   */
  const isActive = (path: string): boolean => {
    return $page.url.pathname === path;
  };

  /**
   * Handles keyboard navigation for accessibility
   * @param event - The keyboard event
   * @param href - The target URL to navigate to
   */
  const handleKeyDown = (event: KeyboardEvent, href: string): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.location.href = href;
    }
  };

  /**
   * Closes dropdown menus when clicking outside of them
   * @param event - The mouse click event
   */
  const handleClickOutside = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;

    if (!target.closest('[data-profile-menu]')) {
      isProfileMenuOpen = false;
    }

    if (!target.closest('[data-utils-menu]')) {
      isUtilsMenuOpen = false;
    }
  };

  /**
   * Sets up event listeners for click outside detection
   * Automatically cleans up previous listeners to prevent memory leaks
   */
  const setupClickOutsideListener = (): void => {
    // Clean up previous listener if it exists
    if (eventListenerCleanup) {
      eventListenerCleanup();
      eventListenerCleanup = null;
    }

    if (isProfileMenuOpen || isUtilsMenuOpen) {
      const handleDocumentClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-navigation]')) {
          isProfileMenuOpen = false;
          isUtilsMenuOpen = false;
        }
      };

      document.addEventListener('click', handleDocumentClick);

      // Store cleanup function for later removal
      eventListenerCleanup = () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }
  };

  // ============================================================================
  // AUTHENTICATION FUNCTIONS
  // ============================================================================

  /**
   * Refreshes the current user session from the API
   * Updates the currentUser state based on the session status
   * @returns Promise with success status and user data
   */
  const refreshUserSession = async (): Promise<{ success: boolean; user?: User | null; error?: string }> => {
    try {
      isSessionLoading = true;
      const response = await fetch(API_ENDPOINTS.SESSION);

      if (response.ok) {
        const data = await response.json();
        currentUser = data.user;
        return { success: true, user: data.user };
      } else if (response.status === 401) {
        currentUser = null;
        return { success: true, user: null };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
      currentUser = null;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al verificar la sesión'
      };
    } finally {
      isSessionLoading = false;
    }
  };

  /**
   * Handles user logout process with enhanced feedback
   * Clears the session, updates UI state, and redirects to home
   */
  const handleLogout = async (): Promise<void> => {
    try {
      isLogoutLoading = true;
      showNotification('Cerrando sesión...');

      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear local user state
        currentUser = null;

        // Close all dropdown menus
        isProfileMenuOpen = false;
        isUtilsMenuOpen = false;

        showNotification('Sesión cerrada exitosamente');
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        console.error('Logout failed:', response.statusText);
        showNotification('Error al cerrar sesión. Por favor, inténtalo de nuevo.', 5000);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      showNotification('Error de conexión. Intentando de nuevo...', 5000);
      // Clear state even on error and redirect
      currentUser = null;
      isProfileMenuOpen = false;
      isUtilsMenuOpen = false;
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } finally {
      isLogoutLoading = false;
    }
  };

  /**
   * Handles successful login process
   * Refreshes user session and closes dropdown menus
   */
  const handleLoginSuccess = async (): Promise<void> => {
    showNotification('¡Bienvenido de vuelta!');
    await refreshUserSession();
    isProfileMenuOpen = false;
    isUtilsMenuOpen = false;
  };

  /**
   * Toggles the utilities dropdown menu with smooth animation
   */
  const toggleUtilsMenu = (): void => {
    isUtilsMenuOpen = !isUtilsMenuOpen;
    
    // If opening the menu, add a click event listener to close it when clicking outside
    if (isUtilsMenuOpen) {
      setTimeout(() => {
        const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as Node;
          const dropdownButton = document.querySelector('[data-utils-menu] button');
          
          if (dropdownMenu && !dropdownMenu.contains(target) && 
              dropdownButton && !dropdownButton.contains(target)) {
            isUtilsMenuOpen = false;
            document.removeEventListener('click', handleClickOutside);
          }
        };
        
        // Add a small delay to prevent immediate closing
        setTimeout(() => {
          document.addEventListener('click', handleClickOutside);
        }, 10);
      });
    }
    
    if (isUtilsMenuOpen) {
      isProfileMenuOpen = false;
    }
  };

  /**
   * Toggles the profile dropdown menu with smooth animation
   */
  const toggleProfileMenu = (): void => {
    isProfileMenuOpen = !isProfileMenuOpen;
    if (isProfileMenuOpen) {
      isUtilsMenuOpen = false;
    }
  };

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  /** Initialize component and check user session on mount */
  onMount(async () => {
    await refreshUserSession();
  });

  // ============================================================================
  // REACTIVE STATEMENTS
  // ============================================================================

  /** Set up click outside listeners when dropdowns are open */
  $: setupClickOutsideListener();

  // ============================================================================
  // EXPORTS
  // ============================================================================

  /** Export utility functions for use in other components */
  export { handleLoginSuccess, handleLogout as logout, refreshUserSession };
</script>

<!-- ========================================================================== -->
<!-- MAIN NAVIGATION HEADER -->
<!-- ========================================================================== -->

<header class="sticky top-0 z-40 border-b shadow-lg backdrop-blur-md bg-white/90 border-gray-200/50">
  <div class="relative" data-navigation>
  <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">

        <!-- Brand/Logo Section -->
        <div class="flex flex-shrink-0 items-center">
          <a
            href="/"
            class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out transform hover:from-indigo-700 hover:to-purple-700 hover:scale-105"
          >
            📚 Librería Arco Iris
          </a>
        </div>

        <!-- Desktop Navigation Menu -->
        <nav class="hidden sm:ml-8 sm:flex sm:space-x-1">
          {#each NAVIGATION_ITEMS as item}
            {#if item.href === '/lista-utiles'}
              <!-- Special dropdown for Lista de Útiles -->
              <div class="relative flex items-center" data-utils-menu>
                <button
                  id="utils-menu-button"
                  on:click|stopPropagation={toggleUtilsMenu}
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleUtilsMenu();
                      } else if (e.key === 'ArrowDown' && isUtilsMenuOpen) {
                        // Focus first menu item when arrow down is pressed
                        const firstItem = dropdownMenu?.querySelector('[role="menuitem"]') as HTMLElement;
                        firstItem?.focus();
                      }
                    }
                  }}
                  class="h-full px-3 py-2 -ml-1 text-sm font-medium transition-all duration-300 ease-in-out border-b-2 {isActive(item.href) || isUtilsMenuOpen ? 'border-indigo-500 text-gray-900 bg-indigo-50/50' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50/50'}"
                  aria-expanded={isUtilsMenuOpen}
                  aria-haspopup="menu"
                  aria-controls="utils-menu"
                  type="button"
                >
                  <div class="flex items-center">
                    <span>{item.name}</span>
                    <span class="px-1.5 py-0.5 ml-2 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                      Nuevo
                    </span>
                    <svg
                      class="ml-1 h-4 w-4 text-gray-500 transition-transform duration-200 {isUtilsMenuOpen ? 'rotate-180' : ''}"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </button>

                {#if isUtilsMenuOpen}
                  <!-- Utilities Dropdown Menu with Animation -->
                  <div
                    bind:this={dropdownMenu}
                    class="absolute left-0 mt-2 w-64 origin-top-left rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50"
                    style="top: 100%;"
                    transition:slide={{ duration: 200 }}
                    on:click|stopPropagation
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="utils-menu-button"
                    tabindex="-1"
                  >
                    <div class="py-2" role="none">
                      <a
                        href="/lista-utiles"
                        class="{DROPDOWN_STYLES.ITEM}"
                        role="menuitem"
                        tabindex="-1"
                        on:keydown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.location.href = '/lista-utiles';
                          }
                        }}
                      >
                        <div class="flex items-center">
                          <svg class="mr-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <div class="font-medium">Escanear lista</div>
                            <div class="text-xs text-gray-500">Sube una imagen o PDF de tu lista</div>
                          </div>
                        </div>
                      </a>
                      <a
                        href="/lista-utiles/crear"
                        class="{DROPDOWN_STYLES.ITEM}"
                        role="menuitem"
                        tabindex="-1"
                        on:keydown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.location.href = '/lista-utiles/crear';
                          }
                        }}
                      >
                        <div class="flex items-center">
                          <svg class="mr-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <div class="font-medium">Crear lista manual</div>
                            <div class="text-xs text-gray-500">Agrega productos uno por uno</div>
                          </div>
                        </div>
                      </a>
                      <a
                        href="/lista-utiles/ejemplo"
                        class="{DROPDOWN_STYLES.ITEM}"
                        role="menuitem"
                        tabindex="-1"
                        on:keydown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.location.href = '/lista-utiles/ejemplo';
                          }
                        }}
                      >
                        <div class="flex items-center">
                          <svg class="mr-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <div class="font-medium">Ver lista de ejemplo</div>
                            <div class="text-xs text-gray-500">Mira cómo funciona</div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                {/if}
              </div>
            {:else}
              <!-- Regular navigation links -->
              <a
                href={item.href}
                on:keydown={(e) => handleKeyDown(e, item.href)}
                class="{NAVIGATION_BASE_CLASSES} {isActive(item.href) ? NAVIGATION_ACTIVE_CLASSES : NAVIGATION_INACTIVE_CLASSES}"
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.name}
              </a>
            {/if}
          {/each}
        </nav>
      </div>

      <!-- Right Side Navigation (Cart & User Menu) -->
      <div class="flex items-center space-x-4">

        <!-- Shopping Cart Link - Only show when user is logged in -->
        {#if currentUser}
          <a
            href="{SHOPPING_ROUTES.CART}"
            class="{BUTTON_STYLES.CART}"
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = SHOPPING_ROUTES.CART;
              }
            }}
            tabindex="0"
            aria-label="Carrito de compras"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m6-5v6a2 2 0 01-2 2H9m4 0h2a2 2 0 002-2v-6"></path>
            </svg>
            {#if $cartItemCount > 0}
              <span class="{FEEDBACK_STYLES.CART_BADGE}">
                {$cartItemCount}
              </span>
            {/if}
          </a>
        {/if}

        {#if currentUser}
          <!-- Authenticated User Menu -->
          <div class="relative ml-4" data-profile-menu>
            <button
              type="button"
              class="relative rounded-full transition-all duration-200 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              id="user-menu-button"
              on:click={toggleProfileMenu}
              on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (toggleProfileMenu(), e.preventDefault())}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
              disabled={isSessionLoading}
            >
              {#if isSessionLoading}
                <div class="{FEEDBACK_STYLES.AVATAR_LOADING}">
                  <div class="{FEEDBACK_STYLES.LOADING_SPINNER}"></div>
                </div>
              {:else}
                <div class="{FEEDBACK_STYLES.AVATAR_USER} group-hover:scale-105 transition-transform duration-200">
                  {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
              {/if}
              <span class="sr-only">Abrir menú de usuario</span>
            </button>

            {#if isProfileMenuOpen}
              <!-- User Profile Dropdown with Animation -->
              <div
                class="absolute right-0 z-50 mt-3 w-56 rounded-xl border ring-1 shadow-xl backdrop-blur-sm origin-top-right bg-white/95 border-gray-200/50 ring-black/5 focus:outline-none"
                transition:slide={{ duration: 200 }}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <div class="py-2">
                  <!-- User Info Header -->
                  <div class="px-4 py-3 border-b border-gray-100">
                    <div class="flex items-center">
                      <div class="{FEEDBACK_STYLES.AVATAR_USER} text-xs">
                        {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">
                          {currentUser.firstName || 'Usuario'}
                        </div>
                        <div class="text-xs text-gray-500">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href="{AUTH_ROUTES.PROFILE}"
                    class="block px-4 py-3 text-sm text-gray-700 rounded-none transition-all duration-200 ease-in-out hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700"
                    role="menuitem"
                    tabindex="-1"
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.location.href = AUTH_ROUTES.PROFILE;
                      }
                    }}
                  >
                    <div class="flex items-center">
                      <svg class="mr-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi perfil
                    </div>
                  </a>
                  <a
                    href="{AUTH_ROUTES.ORDERS}"
                    class="block px-4 py-3 text-sm text-gray-700 rounded-none transition-all duration-200 ease-in-out hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700"
                    role="menuitem"
                    tabindex="-1"
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.location.href = AUTH_ROUTES.ORDERS;
                      }
                    }}
                  >
                    <div class="flex items-center">
                      <svg class="mr-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Mis pedidos
                    </div>
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
                    class="px-4 py-3 w-full text-sm text-left text-gray-700 rounded-none border-t border-gray-100 transition-all duration-200 ease-in-out hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700"
                    role="menuitem"
                    tabindex="-1"
                    disabled={isLogoutLoading}
                  >
                    <div class="flex items-center">
                      {#if isLogoutLoading}
                        <div class="mr-3 h-5 w-5 {FEEDBACK_STYLES.LOADING_SPINNER}"></div>
                      {:else}
                        <svg class="mr-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      {/if}
                      {isLogoutLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
                    </div>
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {:else}
          <!-- Unauthenticated User Actions -->
          <div class="hidden items-center space-x-3 md:flex">
            <a
              href="{AUTH_ROUTES.LOGIN}"
              class="{BUTTON_STYLES.SECONDARY}"
            >
              Iniciar sesión
            </a>
            <a
              href="{AUTH_ROUTES.REGISTER}"
              class="{BUTTON_STYLES.PRIMARY}"
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
    <div class="pt-3 pb-4 space-y-1 bg-gray-50/50">
      {#each NAVIGATION_ITEMS as item}
        <a
          href={item.href}
          class="{BUTTON_STYLES.MOBILE} {isActive(item.href)
            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}"
          class:font-medium={isActive(item.href)}
        >
          <span class="flex justify-between items-center w-full">
            <span>{item.name}</span>
            {#if item.href === '/lista-utiles'}
              <span class="px-2 py-0.5 text-xs font-medium text-indigo-700 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
                Nuevo
              </span>
            {/if}
          </span>
        </a>
      {/each}

      <!-- Carrito móvil -->
      <a
        href="{SHOPPING_ROUTES.CART}"
        class="{BUTTON_STYLES.MOBILE} border-transparent text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:text-indigo-700 flex items-center justify-between"
      >
        <span class="flex items-center">
          <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m6-5v6a2 2 0 01-2 2H9m4 0h2a2 2 0 002-2v-6"></path>
          </svg>
          Carrito
        </span>
        {#if $cartItemCount > 0}
          <span class="{FEEDBACK_STYLES.CART_BADGE}">
            {$cartItemCount}
          </span>
        {/if}
      </a>

      <!-- Menú móvil para usuarios autenticados -->
      {#if isSessionLoading}
        <div class="pt-3 pb-4 space-y-1 border-t border-gray-200">
          <div class="flex justify-center items-center px-4 py-3">
            <div class="mr-3 {FEEDBACK_STYLES.LOADING_SPINNER}"></div>
            <span class="text-sm text-gray-600">Cargando...</span>
          </div>
        </div>
      {:else if currentUser}
        <div class="pt-3 pb-4 space-y-1 border-t border-gray-200">
          <!-- User Info Header Mobile -->
          <div class="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100">
            <div class="{FEEDBACK_STYLES.AVATAR_USER} text-sm mr-3">
              {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate">
                {currentUser.firstName || 'Usuario'}
              </div>
              <div class="text-xs text-gray-500 truncate">
                {currentUser.email}
              </div>
            </div>
          </div>
          <a
            href="{AUTH_ROUTES.PROFILE}"
            class="{BUTTON_STYLES.MOBILE} border-transparent text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:text-indigo-700"
          >
            <span class="flex items-center">
              <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi perfil
            </span>
          </a>
          <a
            href="{AUTH_ROUTES.ORDERS}"
            class="{BUTTON_STYLES.MOBILE} border-transparent text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:text-indigo-700"
          >
            <span class="flex items-center">
              <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mis pedidos
            </span>
          </a>
          <button
            on:click={handleLogout}
            class="{BUTTON_STYLES.MOBILE} border-transparent text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:border-red-300 hover:text-red-700 w-full text-left"
            disabled={isLogoutLoading}
          >
            <span class="flex items-center">
              {#if isLogoutLoading}
                <div class="mr-3 h-5 w-5 {FEEDBACK_STYLES.LOADING_SPINNER}"></div>
              {:else}
                <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              {/if}
              {isLogoutLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </span>
          </button>
        </div>
      {:else}
        <!-- Botones de autenticación móvil -->
        <div class="pt-3 pb-4 space-y-1 border-t border-gray-200">
          <a
            href="{AUTH_ROUTES.LOGIN}"
            class="{BUTTON_STYLES.MOBILE} border-transparent text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 hover:text-gray-900"
          >
            <span class="flex justify-center items-center">
              <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Iniciar sesión
            </span>
          </a>
          <a
            href="{AUTH_ROUTES.REGISTER}"
            class="{BUTTON_STYLES.MOBILE} bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 mx-4 rounded-lg text-center border-transparent shadow-md"
          >
            <span class="flex justify-center items-center">
              <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Registrarse
            </span>
          </a>
        </div>
      {/if}
    </div>
  </div>

  <!-- Notification Toast -->
  {#if notificationMessage}
    <div
      class="fixed top-4 right-4 z-50 w-full max-w-sm"
      transition:slide={{ duration: 300 }}
    >
      <div class="p-4 rounded-lg border border-gray-200 shadow-lg backdrop-blur-sm bg-white/95">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            {#if notificationMessage.includes('Error')}
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            {:else if notificationMessage.includes('Bienvenido')}
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            {:else}
              <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            {/if}
          </div>
          <div class="flex-1 ml-3 w-0">
            <p class="text-sm font-medium text-gray-900">
              {notificationMessage}
            </p>
          </div>
          <div class="flex flex-shrink-0 ml-4">
            <button
              on:click={() => notificationMessage = ''}
              class="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Cerrar notificación"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</header>
