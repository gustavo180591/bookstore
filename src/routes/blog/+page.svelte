<script lang="ts">
    // Basic blog page
    let posts = [
        { id: 1, title: 'Lanzamiento de Libros de Verano', excerpt: 'Descubre nuestras novedades para esta temporada.', date: '2023-10-01' },
        { id: 2, title: 'Guía de Lectura para Principiantes', excerpt: 'Consejos para elegir tu próximo libro.', date: '2023-09-25' }
    ];
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Blog de la Librería</h1>

    <div class="mb-4">
        <a href="/blog/nuevo" class="bg-green-500 text-white px-4 py-2 rounded">Crear Nuevo Post</a>
    </div>

    <div class="grid gap-6">
        {#each posts as post}
            <article class="border p-4 rounded">
                <h2 class="text-xl font-semibold">{post.title}</h2>
                <p class="text-gray-600">{post.date}</p>
                <p>{post.excerpt}</p>
                <a href="/blog/{post.id}" class="text-blue-500">Leer más</a>
            </article>
        {/each}
    </div>
</div>
