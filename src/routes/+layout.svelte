<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { getQueryClient } from '$lib/queryClient';
	import { onMount } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { children } = $props();

	const queryClient = getQueryClient();

	// Limpiar queries al desmontar (importante para SSR)
	onMount(() => {
		// Inicializar DevTools solo en desarrollo
		if (import.meta.env.DEV) {
			try {
				// @ts-ignore - Ignorar errores de TypeScript para esta importación dinámica
				import('@tanstack/svelte-query-devtools').then((module: any) => {
					if (module && typeof module.devtools === 'function') {
						module.devtools(document.body);
					}
				});
			} catch (error) {
				console.warn('TanStack Query DevTools no disponible:', error);
			}
		}

		return () => {
			queryClient.clear();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="min-h-screen flex flex-col">
		<Navigation />
		<main class="flex-grow">
			{@render children?.()}
		</main>
		<Footer />
	</div>
</QueryClientProvider>

<style>
	/* Estilos globales básicos */
	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background-color: #f9fafb;
		color: #111827;
		line-height: 1.5;
	}

	/* Estilos para el catálogo */
	.product-card {
		background-color: white;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease-in-out;
	}

	.product-card:hover {
		transform: translateY(-0.25rem);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid #e5e7eb;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
