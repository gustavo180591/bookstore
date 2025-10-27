# Arquitectura Técnica - Bookstore

## 🏗️ Diseño del Sistema y Stack Tecnológico

### 🎯 **Visión General de la Arquitectura**

El proyecto Bookstore está diseñado como una aplicación e-commerce moderna y escalable, siguiendo las mejores prácticas de arquitectura de software. Utiliza una arquitectura **monolito modular** en las fases iniciales que puede evolucionar hacia **microservicios** según las necesidades de crecimiento.

---

## 🏗️ **1. Arquitectura General**

### **1.1 Stack Tecnológico**
```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Web/Móvil)                      │
├─────────────────────────────────────────────────────────────┤
│  SvelteKit + TypeScript + Tailwind CSS                     │
│  Responsive Design + PWA                                    │
│  Real-time updates via WebSockets                          │
└─────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│                      SERVIDOR (Node.js)                             │
├─────────────────────────────────────────────────────────────────────┤
│  API REST/GraphQL + TypeScript + Express/Fastify                   │
│  Autenticación JWT + Rate Limiting + CORS                           │
│  WebSockets para real-time + Server-Side Rendering                  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│                   BASE DE DATOS (PostgreSQL)                        │
├─────────────────────────────────────────────────────────────────────┤
│  Prisma ORM + Migraciones + Índices optimizados                     │
│  Relaciones complejas + JSON fields para flexibilidad               │
│  Backups automáticos + Point-in-time recovery                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│                  SERVICIOS EXTERNOS                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Mercado Pago (Pagos) + Email/SMS (Notificaciones)                  │
│  Cloud Storage (Imágenes) + CDN (Assets)                           │
│  Analytics (Google/Mixpanel) + Monitoring (Sentry)                  │
└─────────────────────────────────────────────────────────────────────┘
```

### **1.2 Principios de Diseño**
- **Separation of Concerns**: Cada capa tiene responsabilidades claras
- **Single Responsibility**: Componentes y funciones enfocadas
- **Dependency Injection**: Inyección de dependencias para testing
- **SOLID Principles**: Arquitectura orientada a objetos
- **Clean Architecture**: Reglas de negocio independientes de frameworks

---

## 🎨 **2. Frontend Architecture**

### **2.1 SvelteKit Application Structure**
```
src/
├── lib/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes base (buttons, inputs)
│   │   ├── layout/         # Layout components (header, footer)
│   │   ├── forms/          # Formularios complejos
│   │   └── features/       # Componentes de funcionalidades específicas
│   ├── stores/             # Estado global (Svelte stores)
│   ├── utils/              # Utilidades y helpers
│   ├── types/              # Definiciones TypeScript
│   └── services/          # Servicios y API calls
├── routes/                 # File-based routing (SvelteKit)
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Panel de administración
│   ├── (shop)/            # Tienda y catálogo
│   └── api/               # API routes (SSR/API)
└── static/                 # Assets estáticos
```

### **2.2 State Management Strategy**
```typescript
// Estado global con Svelte stores
import { writable, derived, readable } from 'svelte/store';

// Stores principales
export const user = writable<User | null>(null);
export const cart = writable<Cart>({ items: [], total: 0 });
export const notifications = writable<Notification[]>([]);

// Stores derivados
export const cartItemCount = derived(cart, $cart => $cart.items.length);
export const isAuthenticated = derived(user, $user => !!$user);

// Stores de UI
export const loading = writable(false);
export const modal = writable<{ open: boolean; component: any }>({ open: false, component: null });
```

### **2.3 Component Architecture**
```typescript
// Patrón de componentes
interface ComponentProps {
  // Props tipadas estrictamente
}

interface ComponentState {
  // Estado interno del componente
}

class Component {
  // Lifecycle methods
  onMount() {}
  onDestroy() {}

  // Event handlers
  handleClick() {}
  handleSubmit() {}

  // Computed properties
  get computedValue() {}
}
```

### **2.4 Styling System**
```css
/* Design tokens centralizados */
:root {
  /* Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-500: #0ea5e9;
  --color-primary-900: #0c4a6e;

  /* Typography */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

---

## ⚙️ **3. Backend Architecture**

### **3.1 API Design Patterns**
```
📁 src/routes/api/
├── auth/              # Autenticación y sesiones
├── products/          # CRUD de productos
├── cart/              # Gestión de carrito
├── orders/            # Procesamiento de pedidos
├── users/             # Gestión de usuarios
├── institutions/      # Instituciones educativas
├── school-lists/      # Listas escolares
└── admin/             # Panel administrativo
```

### **3.2 Database Design**
```prisma
// Prisma schema con relaciones optimizadas
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  // ... otros campos

  orders    Order[]  // Relación uno-a-muchos
  carts     Cart[]   // Relación uno-a-muchos
  addresses Address[] @relation("UserAddresses") // Relación uno-a-muchos

  @@index([email])    // Índice para búsquedas
  @@index([createdAt]) // Índice para ordenamiento
}

model Product {
  id          String @id @default(cuid())
  sku         String @unique
  name        String
  // ... otros campos

  variants    ProductVariant[] // Relación uno-a-muchos
  categories  Category[] @relation("ProductCategories") // Muchos-a-muchos

  @@index([sku])        // Índice para búsquedas
  @@index([name])       // Índice para búsquedas full-text
  @@index([price])      // Índice para filtros de precio
}
```

### **3.3 Authentication Flow**
```typescript
// Flujo de autenticación seguro
const authFlow = {
  1. LOGIN_REQUEST: 'Cliente envía credenciales',
  2. VALIDATE_USER: 'Validar email y password hash',
  3. CREATE_SESSION: 'Crear session con JWT',
  4. SET_COOKIE: 'Establecer cookie segura httpOnly',
  5. RETURN_USER: 'Devolver datos de usuario sin password'
}
```

### **3.4 Error Handling Strategy**
```typescript
// Manejo centralizado de errores
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

// Middleware de error handling
export const errorHandler = (error: ApiError, request, reply) => {
  logger.error('API Error:', error);

  return reply.status(error.statusCode).send({
    success: false,
    error: error.code,
    message: error.message
  });
}
```

---

## 🗄️ **4. Database Architecture**

### **4.1 PostgreSQL con Prisma**
```prisma
// Schema optimizado para e-commerce
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [uuid_ossp(map: "uuid-ossp")]
}

// Enums para datos consistentes
enum OrderStatus {
  PENDING
  CONFIRMED
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

enum UserRole {
  CUSTOMER
  ADMIN
  MANAGER
}
```

### **4.2 Indexing Strategy**
```sql
-- Índices críticos para performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_products_sku ON products(sku);
CREATE INDEX CONCURRENTLY idx_products_name_search ON products USING gin(to_tsvector('spanish', name));
CREATE INDEX CONCURRENTLY idx_orders_status_date ON orders(status, created_at DESC);
CREATE INDEX CONCURRENTLY idx_cart_items_user_product ON cart_items(user_id, product_id);
```

### **4.3 Query Optimization**
```typescript
// Consultas optimizadas con Prisma
const getProductsWithFilters = async (filters: ProductFilters) => {
  return await prisma.product.findMany({
    where: {
      AND: [
        { categoryId: filters.categoryId },
        { price: { gte: filters.minPrice, lte: filters.maxPrice } },
        { stock: { gt: 0 } }, // Solo productos disponibles
        {
          name: {
            contains: filters.search,
            mode: 'insensitive'
          }
        }
      ]
    },
    include: {
      variants: true,
      categories: true,
      images: { take: 1 } // Solo primera imagen
    },
    orderBy: { [filters.sortBy]: filters.sortOrder },
    take: filters.limit,
    skip: filters.offset
  });
}
```

---

## 🔐 **5. Security Architecture**

### **5.1 Authentication & Authorization**
```typescript
// JWT Strategy con roles
const jwtStrategy = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',
  algorithm: 'HS256'
};

// Middleware de autorización
export const requireAuth = async (request, reply) => {
  try {
    const token = request.cookies.token || request.headers.authorization;
    const decoded = jwt.verify(token, jwtStrategy.secret);

    request.user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!request.user) {
      throw new ApiError(401, 'INVALID_TOKEN', 'Usuario no encontrado');
    }
  } catch (error) {
    throw new ApiError(401, 'AUTH_FAILED', 'Autenticación requerida');
  }
}
```

### **5.2 Rate Limiting**
```typescript
// Rate limiting por endpoint
const rateLimitConfig = {
  global: {
    max: 100, // requests
    timeWindow: '1 minute'
  },
  auth: {
    max: 5, // login attempts
    timeWindow: '15 minutes'
  },
  cart: {
    max: 50,
    timeWindow: '1 minute'
  }
}
```

### **5.3 Input Validation**
```typescript
// Validación con Zod
const productSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().min(10).max(500000),
  sku: z.string().regex(/^[A-Z0-9]{6,12}$/),
  categoryId: z.string().uuid(),
  variants: z.array(variantSchema).min(1)
});

export const validateProduct = (data: unknown) => {
  return productSchema.parse(data);
}
```

---

## 📊 **6. Performance Architecture**

### **6.1 Caching Strategy**
```typescript
// Multi-level caching
const cacheStrategy = {
  // Nivel 1: Memory cache (Node.js)
  memory: {
    products: '15 minutes',
    categories: '1 hour',
    user: '24 hours'
  },

  // Nivel 2: Redis cache (opcional)
  redis: {
    sessions: '24 hours',
    cart: '15 minutes',
    search: '1 hour'
  },

  // Nivel 3: Database cache
  database: {
    static: '1 day',
    dynamic: '5 minutes'
  }
}
```

### **6.2 Database Optimization**
```sql
-- Views materializadas para queries complejas
CREATE MATERIALIZED VIEW product_search AS
SELECT
  id,
  name,
  description,
  price,
  stock,
  category_id,
  to_tsvector('spanish', name || ' ' || description) as search_vector
FROM products
WHERE is_active = true;

-- Refresh cada 15 minutos
REFRESH MATERIALIZED VIEW CONCURRENTLY product_search;
```

### **6.3 Frontend Performance**
```typescript
// Code splitting con SvelteKit
import { browser } from '$app/environment';

// Lazy loading de componentes
const loadComponent = async (componentName: string) => {
  if (browser) {
    return await import(`../components/${componentName}.svelte`);
  }
  return null;
}

// Preloading de rutas críticas
import { preloadData } from '$app/navigation';
preloadData('/catalogo'); // Preload catálogo en background
```

---

## 🔄 **7. Deployment Architecture**

### **7.1 Development Environment**
```
Local Development:
├── SvelteKit dev server (localhost:5173)
├── PostgreSQL (localhost:5432)
├── Redis (localhost:6379) - opcional
└── Email testing (MailHog localhost:1025)
```

### **7.2 Production Environment**
```
Cloud Infrastructure:
├── Frontend: Vercel/Netlify
├── Backend: Railway/Render/Heroku
├── Database: Supabase/PlanetScale
├── Storage: Cloudflare R2/AWS S3
├── CDN: Cloudflare
└── Monitoring: Sentry/Vercel Analytics
```

### **7.3 CI/CD Pipeline**
```yaml
# GitHub Actions workflow
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - run: npm run deploy
```

---

## 📱 **8. Mobile & Responsive Strategy**

### **8.1 Progressive Web App (PWA)**
```typescript
// Service Worker para offline
const swConfig = {
  cacheFirst: [
    '/api/products',
    '/images/*'
  ],
  networkFirst: [
    '/api/cart',
    '/api/orders'
  ],
  staleWhileRevalidate: [
    '/api/categories'
  ]
}
```

### **8.2 Responsive Breakpoints**
```css
/* Tailwind responsive design */
sm: '640px',   /* Small devices */
md: '768px',   /* Medium devices */
lg: '1024px',  /* Large devices */
xl: '1280px',  /* Extra large */
2xl: '1536px'  /* 2X large */
```

### **8.3 Touch-Friendly Design**
```css
/* Touch targets de al menos 44px */
.button-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Gestos táctiles */
.swipeable {
  touch-action: pan-y;
  user-select: none;
}
```

---

## 🔧 **9. Monitoring & Observability**

### **9.1 Application Monitoring**
```typescript
// Sentry para error tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV
});

// Métricas personalizadas
const metrics = {
  responseTime: histogram('http_request_duration_seconds'),
  errorRate: counter('http_requests_total', { status: 'error' }),
  activeUsers: gauge('active_users')
}
```

### **9.2 Business Metrics**
```typescript
// KPIs críticos
const businessMetrics = {
  conversionRate: 'carrito_a_pedido',
  averageOrderValue: 'valor_promedio_pedido',
  customerLifetimeValue: 'clv_por_cliente',
  churnRate: 'tasa_abandono'
}
```

### **9.3 Performance Monitoring**
```typescript
// Web Vitals
const webVitals = {
  LCP: 'Largest Contentful Paint',
  FID: 'First Input Delay',
  CLS: 'Cumulative Layout Shift',
  FCP: 'First Contentful Paint',
  TTFB: 'Time to First Byte'
}
```

---

## 🌐 **10. API Architecture**

### **10.1 REST API Design**
```typescript
// Estructura de responses
const apiResponse = {
  success: true,
  data: { /* datos solicitados */ },
  meta: {
    pagination: { page: 1, limit: 20, total: 100 },
    filters: { category: 'libros', price: '100-500' }
  }
}

// Error responses
const errorResponse = {
  success: false,
  error: 'VALIDATION_ERROR',
  message: 'Datos inválidos',
  details: {
    field: 'email',
    issue: 'Formato inválido'
  }
}
```

### **10.2 GraphQL Schema (Futuro)**
```graphql
type Query {
  products(filters: ProductFilters): [Product!]!
  product(id: ID!): Product
  categories: [Category!]!
  orders(userId: ID!): [Order!]!
}

type Mutation {
  createOrder(input: CreateOrderInput!): Order!
  updateCart(input: UpdateCartInput!): Cart!
  login(input: LoginInput!): AuthPayload!
}
```

---

## 🔄 **11. Real-time Features**

### **11.1 WebSocket Implementation**
```typescript
// Socket.io para features real-time
const socketEvents = {
  // Stock updates
  STOCK_UPDATED: 'stock:updated',
  STOCK_LOW: 'stock:low',

  // Order updates
  ORDER_STATUS_CHANGED: 'order:status:changed',
  ORDER_SHIPPED: 'order:shipped',

  // Cart updates
  CART_UPDATED: 'cart:updated',
  CART_EXPIRED: 'cart:expired',

  // User notifications
  USER_NOTIFICATION: 'user:notification'
}
```

### **11.2 Server-Sent Events (SSE)**
```typescript
// SSE para updates en tiempo real
const sseEvents = {
  cart: '/api/events/cart',
  orders: '/api/events/orders',
  products: '/api/events/products'
}
```

---

## 📈 **12. Scalability Considerations**

### **12.1 Horizontal Scaling**
```typescript
// Load balancing configuration
const loadBalancer = {
  algorithm: 'round-robin',
  healthCheck: '/api/health',
  stickySessions: true,
  sslTermination: true
}
```

### **12.2 Database Scaling**
```sql
-- Read replicas para queries de lectura
CREATE PUBLICATION bookstore_publication FOR ALL TABLES;

-- Replicas de lectura
CREATE SUBSCRIPTION bookstore_subscription
CONNECTION 'host=replica.db.url'
PUBLICATION bookstore_publication;
```

### **12.3 CDN Strategy**
```javascript
// Cloudflare configuration
const cdnConfig = {
  cacheEverything: true,
  cacheTtl: {
    static: '1 year',
    dynamic: '5 minutes',
    api: '30 seconds'
  },
  edgeLocations: ['global']
}
```

---

## 🧪 **13. Testing Architecture**

### **13.1 Testing Strategy**
```typescript
// Pirámide de testing
const testingPyramid = {
  unit: '70%',        // Funciones individuales
  integration: '20%', // Componentes y APIs
  e2e: '10%'         // Flujos completos de usuario
}

// Testing tools
const testingStack = {
  unit: 'Jest + Testing Library',
  integration: 'Playwright + Svelte Testing Library',
  e2e: 'Playwright + Cucumber',
  visual: 'Chromatic + Percy'
}
```

### **13.2 Test Coverage Goals**
```javascript
const coverageGoals = {
  statements: 90,
  branches: 85,
  functions: 90,
  lines: 90,
  criticalPaths: 100
}
```

---

## 🔒 **14. Security Architecture**

### **14.1 Security Layers**
```typescript
// Multi-layer security
const securityLayers = {
  1. NETWORK: 'Firewall, VPN, WAF',
  2. APPLICATION: 'Input validation, CSRF, XSS protection',
  3. DATA: 'Encryption at rest, access controls',
  4. MONITORING: 'Intrusion detection, log analysis'
}
```

### **14.2 Compliance Requirements**
```typescript
// PCI DSS para pagos
const pciCompliance = {
  cardData: 'Tokenized and encrypted',
  transmission: 'TLS 1.3 minimum',
  storage: 'No card data stored',
  access: 'Role-based access controls'
}

// LPDP (Argentina)
const lpdpCompliance = {
  consent: 'Explicit consent for marketing',
  retention: '2 years post-purchase',
  portability: 'JSON export available',
  deletion: 'Automated cleanup process'
}
```

---

## 📚 **15. Documentation Architecture**

### **15.1 API Documentation**
```typescript
// OpenAPI/Swagger specs
const apiDocs = {
  openapi: '3.0.3',
  info: {
    title: 'Bookstore API',
    version: '1.0.0',
    description: 'E-commerce API para librería'
  },
  servers: [
    { url: 'https://api.bookstore.com', description: 'Production' },
    { url: 'https://staging-api.bookstore.com', description: 'Staging' }
  ]
}
```

### **15.2 Development Documentation**
```markdown
<!-- Documentation structure -->
docs/
├── 01-historia.md          # Business context
├── 02-schema.md           # Database schema
├── 03-routes.md           # API documentation
├── 04-rules.md            # Business rules
├── 05-roles.md            # Team roles
├── 06-roadmap.md          # Development roadmap
├── use_cases.md           # User stories
├── architecture.md        # Technical architecture
├── deployment.md          # Deployment guide
└── security.md            # Security guidelines
```

---

## 🎯 **16. Architecture Decisions**

### **16.1 Key Decisions Made**
```typescript
// Framework choices
FRAMEWORK_DECISIONS = {
  frontend: 'SvelteKit - SSR, performance, developer experience',
  backend: 'Node.js/TypeScript - scalability, ecosystem',
  database: 'PostgreSQL - ACID compliance, complex queries',
  orm: 'Prisma - type safety, migrations, developer experience',
  auth: 'JWT - stateless, scalable, industry standard'
}

// Architecture patterns
PATTERNS = {
  state: 'Svelte stores - reactive, simple, performant',
  components: 'Atomic design - reusable, maintainable',
  api: 'REST with resource-based URLs - intuitive, cacheable',
  database: 'Normalized schema - no data duplication, referential integrity'
}
```

### **16.2 Trade-offs Considered**
```typescript
// Performance vs Developer Experience
TRADEOFFS = {
  SSR: 'Better SEO and performance, but more complex',
  ClientSide: 'Simpler development, but SEO challenges',
  GraphQL: 'Flexible queries, but more complex than REST',
  Microservices: 'Scalable, but overkill for MVP'
}
```

---

## 🔮 **17. Future Architecture Evolution**

### **17.1 Microservices Migration (Fase 3)**
```
Monolith (Current) → Modular Monolith → Microservices

Services:
├── auth-service          # Autenticación centralizada
├── product-service       # Catálogo y inventario
├── order-service         # Procesamiento de pedidos
├── payment-service       # Integración con pasarelas
├── notification-service  # Email/SMS/Push
├── analytics-service     # Métricas y reportes
└── inventory-service     # Control de stock real-time
```

### **17.2 Advanced Features (Fase 3)**
```typescript
// AI/ML Integration
const advancedFeatures = {
  recommendations: 'Machine learning product recommendations',
  demandForecasting: 'Predictive inventory management',
  dynamicPricing: 'Price optimization based on demand',
  fraudDetection: 'Anomaly detection in transactions',
  chatbots: 'AI-powered customer service'
}
```

---

## 📋 **18. Implementation Checklist**

### **✅ Completed Architecture**
- [x] **Database Schema**: PostgreSQL con Prisma ORM
- [x] **API Structure**: RESTful con SvelteKit
- [x] **Authentication**: JWT con roles y permisos
- [x] **Frontend**: SvelteKit con TypeScript
- [x] **Security**: Input validation y rate limiting
- [x] **Performance**: Caching strategy y optimización

### **🚧 In Progress**
- [ ] **Real-time Features**: WebSockets para stock y notificaciones
- [ ] **Advanced Analytics**: Business intelligence y métricas
- [ ] **Mobile Optimization**: PWA y offline capabilities
- [ ] **API Documentation**: OpenAPI specs completas

### **❌ Planned for Future**
- [ ] **Microservices**: Separación en servicios independientes
- [ ] **GraphQL API**: Para consultas más flexibles
- [ ] **Event-Driven Architecture**: Para decoupling de sistemas
- [ ] **Multi-tenant**: Soporte para múltiples tiendas

---

## 🎉 **Architecture Benefits**

### **Developer Experience**
- **Type Safety**: TypeScript en todo el stack
- **Developer Tools**: Hot reload, debugging, testing
- **Documentation**: Auto-generada y actualizada
- **Best Practices**: Clean code, SOLID principles

### **User Experience**
- **Performance**: < 500ms response times
- **Reliability**: 99.9% uptime con monitoring
- **Scalability**: Horizontal scaling capabilities
- **Security**: Enterprise-grade security measures

### **Business Value**
- **Maintainability**: Código modular y documentado
- **Extensibility**: Fácil agregar nuevas features
- **Cost-Effective**: Infraestructura optimizada
- **Future-Proof**: Arquitectura preparada para crecimiento

---

## 📚 **Related Documentation**
- **Project History**: `01 - historia.md`
- **Database Schema**: `02 - schema.md`
- **API Routes**: `03 - routes.md`
- **Business Rules**: `04 - rules.md`
- **Team Roles**: `05 - roles-tecnicos-ejecutivos.md`
- **Development Roadmap**: `06 - roadmap.md`
- **Use Cases**: `use_cases.md`
- **Client Requirements**: `cliente.md`
- **To-Do List**: `to_do.md`
