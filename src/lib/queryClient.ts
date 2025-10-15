import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';

// Crear QueryClient con configuración optimizada
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos (antes cacheTime)
        retry: (failureCount: number, error: unknown) => {
          // No reintentar en errores 4xx (cliente)
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as { status: number }).status;
            if (status >= 400 && status < 500) {
              return false;
            }
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// QueryClient global (singleton)
let globalQueryClient: QueryClient;

export function getQueryClient() {
  if (browser && globalQueryClient) {
    return globalQueryClient;
  }

  globalQueryClient = createQueryClient();
  return globalQueryClient;
}
