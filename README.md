# 📚 Bookstore - E-commerce para Librería Arco Iris

[![Estado del Proyecto](https://img.shields.io/badge/Estado-MVP%2070%25-brightgreen)]()
[![SvelteKit](https://img.shields.io/badge/SvelteKit-1.0-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)]()
[![Prisma](https://img.shields.io/badge/Prisma-5.0-blue)]()

> **Sistema de gestión e-commerce para librería especializada en útiles escolares, libros y artículos de oficina con control de stock en tiempo real.**

---

## 🎯 **Visión General**

**Librería Arco Iris** es una tienda online moderna diseñada para facilitar la compra de útiles escolares y artículos de librería. El sistema permite a los clientes realizar compras 24/7 desde cualquier dispositivo, con opciones de pago en línea, retiro en local y envíos a domicilio.

### **✨ Características Principales**
- 🛒 **Catálogo completo** con filtros avanzados y búsqueda inteligente
- 📱 **Diseño responsive** optimizado para todos los dispositivos
- 🔄 **Control de stock** en tiempo real con reserva temporal
- 💳 **Integración con Mercado Pago** para pagos seguros
- 🏫 **Listas escolares** con OCR automático para instituciones
- 📊 **Panel administrativo** completo para gestión del negocio
- 🔔 **Sistema de notificaciones** para seguimiento de pedidos

---

## 🚀 **Estado del Proyecto**

### **✅ Implementado (70%)**
- [x] **Backend Core**: API REST completa con autenticación JWT
- [x] **Base de Datos**: PostgreSQL con Prisma ORM
- [x] **Frontend Moderno**: SvelteKit con TypeScript y Tailwind CSS
- [x] **Autenticación**: Registro, login, sesiones seguras
- [x] **Catálogo**: Productos con variantes y categorías
- [x] **Carrito**: Gestión completa con persistencia
- [x] **Panel Admin**: CRUD básico de productos y usuarios

### **🚧 En Desarrollo (20%)**
- [ ] **Reserva de Stock**: 15 minutos timeout en carrito
- [ ] **Integración Mercado Pago**: Webhooks y confirmaciones
- [ ] **Sistema de Envíos**: Cálculo por código postal
- [ ] **OCR para Listas**: Procesamiento automático de imágenes

### **📋 Planificado (10%)**
- [ ] **Sistema de Promociones**: Cupones y descuentos automáticos
- [ ] **Devoluciones/RMA**: Proceso completo de cambios
- [ ] **Blog/CMS**: Gestión de contenido y SEO
- [ ] **Programa de Fidelización**: Puntos y beneficios

---

## 🛠️ **Stack Tecnológico**

### **Frontend**
- **Framework**: [SvelteKit](https://svelte.dev/) - SSR y SPA híbrido
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) - Type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **State Management**: Svelte Stores - Reactivo y eficiente
- **Animations**: Svelte Transitions - Suaves y performantes

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime
- **Framework**: [SvelteKit API Routes](https://svelte.dev/docs/kit/routing) - Serverless-ready
- **ORM**: [Prisma](https://www.prisma.io/) - Type-safe database toolkit
- **Database**: [PostgreSQL](https://postgresql.org/) - Robust relational DB
- **Authentication**: JWT - Stateless y escalable

### **DevOps & Tools**
- **Package Manager**: npm - Gestión de dependencias
- **Linting**: ESLint + Prettier - Code quality
- **Testing**: Jest + Playwright - Testing completo
- **Deployment**: Vercel/Netlify - Zero-config deployment
- **Monitoring**: Sentry - Error tracking y performance

---

## 📋 **Instalación y Configuración**

### **Prerrequisitos**
```bash
# Node.js 18+ y npm
node --version  # >= 18.0.0
npm --version   # >= 8.0.0

# PostgreSQL 14+
psql --version  # >= 14.0

# Git
git --version   # >= 2.30.0
```

### **Configuración Inicial**
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/bookstore.git
cd bookstore

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Configurar base de datos
npx prisma generate
npx prisma db push

# 5. Ejecutar migraciones (si es necesario)
npx prisma migrate dev --name init

# 6. Iniciar servidor de desarrollo
npm run dev
```

### **Variables de Entorno (.env)**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bookstore"

# Autenticación
JWT_SECRET="tu-jwt-secret-super-seguro"
ENCRYPTION_KEY="tu-encryption-key"

# Mercado Pago (para producción)
MP_PUBLIC_KEY="tu-public-key"
MP_ACCESS_TOKEN="tu-access-token"
MP_WEBHOOK_SECRET="tu-webhook-secret"

# Email (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"

# Otros
NODE_ENV="development"
PORT="3000"
```

---

## 🎮 **Comandos Disponibles**

### **Desarrollo**
```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build de producción
npm run check    # Type checking con TypeScript
```

### **Base de Datos**
```bash
npx prisma studio    # Interfaz visual de base de datos
npx prisma generate  # Generar cliente de Prisma
npx prisma db push   # Aplicar cambios al schema
npx prisma migrate dev  # Crear y aplicar migración
```

### **Testing y Calidad**
```bash
npm run test         # Ejecutar tests unitarios
npm run test:e2e     # Tests end-to-end con Playwright
npm run lint         # Linting con ESLint
npm run format       # Formateo con Prettier
```

### **Deployment**
```bash
npm run build        # Build optimizado
npm run deploy       # Deploy a Vercel/Netlify
```

---

## 📁 **Estructura del Proyecto**

```
bookstore/
├── 📄 README.md                    # Documentación principal
├── 📁 docs/                        # Documentación completa
│   ├── 01 - historia.md           # Contexto del negocio
│   ├── 02 - schema.md             # Esquema de base de datos
│   ├── 03 - routes.md             # Documentación de API
│   ├── 04 - rules.md              # Reglas de negocio
│   ├── 05 - roles-tecnicos-ejecutivos.md # Roles del equipo
│   ├── 06 - roadmap.md            # Planificación estratégica
│   ├── architecture.md            # Arquitectura técnica
│   └── use_cases.md               # Casos de uso detallados
├── 📁 src/
│   ├── 📁 lib/                    # Librerías y utilidades
│   │   ├── components/            # Componentes Svelte
│   │   ├── stores/                # Estado global
│   │   ├── types/                 # Definiciones TypeScript
│   │   └── services/              # Servicios y API calls
│   ├── 📁 routes/                 # Rutas de SvelteKit
│   │   ├── (auth)/               # Páginas de autenticación
│   │   ├── (dashboard)/          # Panel administrativo
│   │   ├── (shop)/               # Tienda y catálogo
│   │   └── api/                  # API endpoints
│   └── 📁 static/                 # Assets estáticos
├── 📁 prisma/                     # Configuración de Prisma
│   └── schema.prisma              # Esquema de base de datos
├── 📄 package.json                # Dependencias y scripts
├── 📄 tailwind.config.js          # Configuración de Tailwind
├── 📄 tsconfig.json               # Configuración TypeScript
└── 📄 svelte.config.js            # Configuración SvelteKit
```

---

## 🎯 **Funcionalidades Clave**

### **🛒 Para Clientes**
- **Catálogo completo** con filtros por categoría, precio, marca
- **Búsqueda inteligente** con sugerencias automáticas
- **Carrito persistente** con reserva de stock temporal
- **Checkout seguro** con múltiples métodos de pago
- **Seguimiento de pedidos** en tiempo real
- **Listas escolares** con procesamiento OCR

### **🏪 Para Administradores**
- **Panel completo** para gestión de productos y pedidos
- **Control de stock** en tiempo real
- **Reportes y analytics** de ventas y performance
- **Gestión de usuarios** y permisos por rol
- **Configuración de envíos** y zonas de entrega
- **Sistema de promociones** y descuentos

### **🏫 Para Instituciones**
- **Listas escolares personalizadas** por grado e institución
- **Procesamiento automático** de listas físicas vía OCR
- **Presupuestos automáticos** con productos disponibles
- **Condiciones especiales** para compras institucionales
- **Reportes de compras** por institución

---

## 📊 **Métricas y KPIs**

### **Performance**
- ⚡ **Tiempo de respuesta API**: < 500ms (p95)
- 🚀 **Tiempo de carga inicial**: < 2 segundos
- 📈 **Disponibilidad**: 99.9% uptime
- 🔍 **Lighthouse Score**: > 90 en todas las métricas

### **Negocio**
- 🛒 **Tasa de conversión**: > 5% (carrito → pedido)
- 👥 **Usuarios activos**: 500+ semanales (objetivo)
- 💰 **Valor promedio pedido**: $2,500
- ⭐ **Satisfacción cliente**: > 4.5/5 estrellas

---

## 🧪 **Testing**

### **Estrategia de Testing**
- **Unit Tests**: Funciones y utilidades individuales
- **Integration Tests**: Componentes y flujos completos
- **E2E Tests**: Experiencia completa del usuario
- **Performance Tests**: Carga y estrés del sistema

### **Coverage Goals**
- 📊 **Statements**: > 90%
- 🌿 **Branches**: > 85%
- 🔧 **Functions**: > 90%
- 📝 **Lines**: > 90%

---

## 🚀 **Deployment**

### **Desarrollo**
```bash
# Local development
npm run dev          # http://localhost:5173
npx prisma studio    # http://localhost:5555 (DB)
```

### **Producción**
```bash
# Build optimizado
npm run build

# Preview build
npm run preview

# Deploy automático (Vercel/Netlify)
npm run deploy
```

### **Variables de Producción**
```bash
# Configurar en el proveedor de hosting
DATABASE_URL=postgresql://...
JWT_SECRET=...
MP_ACCESS_TOKEN=...
NODE_ENV=production
```

---

## 📚 **Documentación**

### **📖 Guías Completas**
- **[Historia del Proyecto](docs/01%20-%20historia.md)** - Contexto del negocio y objetivos
- **[Esquema de BD](docs/02%20-%20schema.md)** - Modelos de datos y relaciones
- **[API Routes](docs/03%20-%20routes.md)** - Documentación completa de endpoints
- **[Reglas de Negocio](docs/04%20-%20rules.md)** - Validaciones y lógica de negocio
- **[Roles del Equipo](docs/05%20-%20roles-tecnicos-ejecutivos.md)** - Estructura organizacional
- **[Roadmap](docs/06%20-%20roadmap.md)** - Planificación estratégica
- **[Arquitectura](docs/architecture.md)** - Diseño técnico del sistema
- **[Casos de Uso](docs/use_cases.md)** - User stories detalladas

### **🔗 Recursos Adicionales**
- [SvelteKit Documentation](https://svelte.dev/docs/kit) - Framework frontend
- [Prisma Documentation](https://www.prisma.io/docs) - ORM y base de datos
- [Tailwind CSS](https://tailwindcss.com/docs) - Framework CSS
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type safety

---

## 🤝 **Contribución**

### **Para Desarrolladores**
1. **Fork** el repositorio
2. **Crea** una branch para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Add nueva funcionalidad'`)
4. **Push** a la branch (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

### **Estándares de Código**
- **TypeScript**: Strict mode habilitado
- **ESLint + Prettier**: Configuración automática
- **Conventional Commits**: Para mensajes de commit
- **Pull Request Template**: Para revisiones consistentes

---

## 📞 **Soporte y Contacto**

### **Equipo de Desarrollo**
- **Tech Lead**: [Nombre] - Arquitectura y decisiones técnicas
- **Frontend Developer**: [Nombre] - UI/UX y experiencia de usuario
- **Backend Developer**: [Nombre] - APIs y lógica de negocio
- **DevOps**: [Nombre] - Infraestructura y deployments

### **Contacto del Negocio**
- **Email**: chabelabookstore@gmail.com
- **Teléfono**: +54 9 376 123-4567
- **Dirección**: Eva Perón 1234, Villa Cabello, Posadas - Misiones

---

## 📄 **Licencia**

Este proyecto es propiedad de **Librería Arco Iris**. Todos los derechos reservados.

---

## 🙏 **Agradecimientos**

- **Svelte Team** por el excelente framework
- **Prisma Team** por el ORM más developer-friendly
- **Tailwind CSS** por el sistema de diseño utilitario
- **Vercel** por la plataforma de deployment
- **Comunidad Open Source** por las herramientas y librerías

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**

---

## 🔄 **Changelog**

### **v2.0.0** (Actual)
- ✅ **MVP 70% completado** con funcionalidades core
- ✅ **Arquitectura moderna** con SvelteKit y TypeScript
- ✅ **Base de datos optimizada** con PostgreSQL y Prisma
- ✅ **Diseño responsive** con Tailwind CSS
- 🚧 **Funcionalidades críticas** en desarrollo

### **v1.0.0** (Planificado - Dic 2024)
- 🎯 **Lanzamiento MVP** completo y funcional
- 🚀 **Integración con Mercado Pago** operativa
- 📦 **Sistema de envíos** implementado
- 📊 **Analytics básicos** configurados

---

*Última actualización: Octubre 2024*
