<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { getQueryClient } from '$lib/queryClient';
	import { onMount } from 'svelte';

	let { children } = $props();

	const queryClient = getQueryClient();

	// Limpiar queries al desmontar (importante para SSR)
	onMount(() => {
		return () => {
			queryClient.clear();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	{@render children?.()}
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
