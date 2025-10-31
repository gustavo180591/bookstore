<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  interface BlogPost {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    date: string;
    author: string;
  }
  
  // Get the post ID from the URL with a default value
  const postId: string = $page.params.id || '';
  
  // Sample data - in a real app, you would fetch this from an API
  const posts: Record<string, BlogPost> = {
    '1': {
      id: 1,
      title: 'Lanzamiento de Libros de Verano',
      content: 'Contenido detallado del primer post sobre los lanzamientos de verano...',
      excerpt: 'Descubre nuestras novedades para esta temporada.',
      date: '2023-10-01',
      author: 'Equipo de la Librería'
    },
    '2': {
      id: 2,
      title: 'Guía de Lectura para Principiantes',
      content: 'Contenido detallado de la guía de lectura para principiantes...',
      excerpt: 'Consejos para elegir tu próximo libro.',
      date: '2023-09-25',
      author: 'Equipo de la Librería'
    }
  };
  
  let post = $state<BlogPost | null>(null);
  let loading = $state(true);
  
  onMount(() => {
    // In a real app, you would fetch the post from an API
    // For now, we'll use the sample data
    setTimeout(() => {
      post = posts[postId] || null;
      if (!post) {
        // Redirect to 404 if post not found
        goto('/blog/not-found');
      }
      loading = false;
    }, 300);
  });
  
  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }
</script>

<div class="container mx-auto p-4 max-w-3xl">
  {#if loading}
    <div class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-2">Cargando publicación...</p>
    </div>
  {:else if post}
    <a href="/blog" class="text-blue-500 hover:underline mb-4 inline-block">
      ← Volver al blog
    </a>
    
    <article class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold mb-2">{post.title}</h1>
      <div class="text-gray-600 mb-6">
        <span>Por {post.author}</span>
        <span class="mx-2">•</span>
        <span>{formatDate(post.date)}</span>
      </div>
      
      <div class="prose max-w-none">
        <p class="text-lg">{post.content}</p>
      </div>
      
      <div class="mt-8 pt-4 border-t border-gray-200">
        <a href="/blog" class="text-blue-500 hover:underline">
          ← Volver a todas las publicaciones
        </a>
      </div>
    </article>
  {/if}
</div>
