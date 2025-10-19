<script lang="ts">
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Comprar',
      links: [
        { text: 'Productos', href: '/catalogo' },
        { text: 'Ofertas', href: '/ofertas' },
        { text: 'Novedades', href: '/novedades' },
        { text: 'Lista de útiles', href: '/lista-utiles' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { text: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
        { text: 'Términos y condiciones', href: '/terminos' },
        { text: 'Políticas de privacidad', href: '/privacidad' },
        { text: 'Contacto', href: '/contacto' },
      ],
    },
    {
      title: 'Mi cuenta',
      links: [
        { text: 'Mis pedidos', href: '/mi-cuenta/pedidos' },
        { text: 'Mis direcciones', href: '/mi-cuenta/direcciones' },
        { text: 'Mis listas guardadas', href: '/mi-cuenta/listas' },
        { text: 'Configuración', href: '/mi-cuenta/configuracion' },
      ],
    },
  ];
  
  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'facebook' },
    { name: 'Instagram', href: '#', icon: 'instagram' },
    { name: 'Twitter', href: '#', icon: 'twitter' },
    { name: 'WhatsApp', href: '#', icon: 'whatsapp' },
  ];
  
  const getIconPath = (icon: string) => {
    switch (icon) {
      case 'facebook':
        return 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z';
      case 'instagram':
        return 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z';
      case 'twitter':
        return 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z';
      case 'whatsapp':
        return 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.147-.67.15-.197.295-.771.955-.944 1.152-.174.195-.347.21-.646.075-.3-.15-1.266-.465-2.412-1.485-.888-.795-1.484-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.136-.135.298-.354.446-.532.15-.18.198-.3.298-.496.1-.21.049-.375-.025-.523-.075-.15-.67-1.598-.922-2.191-.24-.568-.487-.494-.67-.503-.172-.007-.371-.01-.57-.01-.2 0-.524.06-.797.3-.273.24-1.04 1.006-1.04 2.456s1.07 2.85 1.218 3.045c.149.197 2.096 3.18 5.078 4.455.71.3 1.264.48 1.695.615.714.227 1.365.195 1.88.118.57-.08 1.76-.72 2.006-1.425.248-.706.248-1.312.173-1.425-.074-.12-.272-.18-.57-.33m-5.446 7.443h-.016c-1.77 0-3.525-.48-5.055-1.38l-.36-.216-3.75.975 1.005-3.645-.239-.375a9.878 9.878 0 01-1.515-5.261c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.896 6.994c-.003 5.45-4.437 9.888-9.885 9.888m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.55 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.723 1.448h.006c6.554 0 11.89-5.335 11.89-11.893 0-3.18-1.262-6.196-3.553-8.464';
      default:
        return '';
    }
  };
</script>

<footer class="bg-gray-50 border-t border-gray-200 mt-12">
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
    <div class="xl:grid xl:grid-cols-3 xl:gap-8">
      <div class="space-y-8 xl:col-span-1">
        <h2 class="text-2xl font-bold text-gray-900">Librería Arco Iris</h2>
        <p class="text-gray-500 text-base">
          Tu tienda de confianza para todos los útiles escolares y materiales educativos.
        </p>
        <div class="flex space-x-6">
          {#each socialLinks as link}
            <a href={link.href} class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">{link.name}</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d={getIconPath(link.icon)} clip-rule="evenodd" />
              </svg>
            </a>
          {/each}
        </div>
      </div>
      
      <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
        {#each footerLinks as section}
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul role="list" class="mt-4 space-y-4">
                {#each section.links as link}
                  <li>
                    <a 
                      href={link.href} 
                      class="text-base text-gray-500 hover:text-gray-900"
                    >
                      {link.text}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="mt-12 border-t border-gray-200 pt-8">
      <p class="text-base text-gray-400 text-center">
        &copy; {currentYear} Librería Arco Iris. Todos los derechos reservados.
      </p>
      <div class="mt-4 flex justify-center space-x-6 text-sm text-gray-500">
        <a href="/terminos" class="hover:text-gray-900">Términos y condiciones</a>
        <span>•</span>
        <a href="/privacidad" class="hover:text-gray-900">Política de privacidad</a>
        <span>•</span>
        <a href="/contacto" class="hover:text-gray-900">Contáctanos</a>
      </div>
    </div>
  </div>
</footer>
