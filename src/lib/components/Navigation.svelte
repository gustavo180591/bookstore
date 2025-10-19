<script lang="ts">
  import { page } from '$app/stores';
  import { cartItemCount } from '$lib/stores/cart';
  
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
  
  // Handle keyboard events for accessibility
  const handleKeyDown = (event: KeyboardEvent, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.location.href = href;
    }
  };
</script>

<header class="bg-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-xl font-bold text-indigo-600">Librería Arco Iris</a>
        </div>
        <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
          {#each navItems as item}
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
              {#if item.href === '/lista-utiles'}
                <span class="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                  Nuevo
                </span>
              {/if}
            </a>
          {/each}
        </nav>
      </div>
      
      <div class="flex items-center">
        <a href="/carrito" class="p-1 rounded-full text-gray-400 hover:text-gray-500 relative">
          <span class="sr-only">Ver carrito</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {#if $cartItemCount > 0}
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {$cartItemCount}
            </span>
          {/if}
        </a>
        
        <div class="ml-4 flex items-center md:ml-6">
          <a href="/auth/login" class="text-sm font-medium text-gray-700 hover:text-gray-900">
            Iniciar sesión
          </a>
          <span class="mx-2 text-gray-300">|</span>
          <a href="/auth/register" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Registrarse
          </a>
        </div>
      </div>
    </div>
  </div>
  
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
