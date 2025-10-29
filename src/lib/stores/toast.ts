import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  
  function show(message: string, type: ToastType = 'info', duration: number = 5000) {
    const id = Date.now();
    
    update((toasts) => [
      ...toasts,
      { id, message, type, duration }
    ]);
    
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
    
    return id;
  }
  
  function dismiss(id: number) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }
  
  return {
    subscribe,
    show,
    dismiss,
    success: (message: string, duration?: number) => show(message, 'success', duration),
    error: (message: string, duration?: number) => show(message, 'error', duration),
    warning: (message: string, duration?: number) => show(message, 'warning', duration),
    info: (message: string, duration?: number) => show(message, 'info', duration)
  };
}

export const toast = createToastStore();

export function showToast(message: string, type: ToastType = 'info', duration: number = 5000) {
  return toast.show(message, type, duration);
}
