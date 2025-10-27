# API Routes Documentation - Bookstore

## 📋 Rutas y Endpoints de la API

### 🔐 **Autenticación** (`/api/auth/*`)
- `GET /api/auth/session` - Verificar sesión actual
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/logout` - Cerrar sesión

### 🛒 **Carrito de Compras** (`/api/cart/*`)
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Crear nuevo carrito
- `PUT /api/cart` - Actualizar carrito
- `DELETE /api/cart` - Eliminar carrito
- `POST /api/cart/items` - Agregar item al carrito
- `PUT /api/cart/items/{id}` - Actualizar item del carrito
- `DELETE /api/cart/items/{id}` - Eliminar item del carrito

### 📦 **Productos** (`/api/products/*`)
- `GET /api/products` - Listar productos con filtros
- `GET /api/products/{id}` - Obtener producto específico
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/{id}` - Actualizar producto (Admin)
- `DELETE /api/products/{id}` - Eliminar producto (Admin)

### 🏫 **Instituciones** (`/api/institutions/*`)
- `GET /api/institutions` - Listar instituciones
- `GET /api/institutions/{id}` - Obtener institución específica

### 📋 **Listas Escolares** (`/api/school-lists/*`)
- `GET /api/school-lists` - Listar listas escolares
- `GET /api/school-lists/{id}` - Obtener lista específica
- `POST /api/school-lists` - Crear lista escolar
- `PUT /api/school-lists/{id}` - Actualizar lista
- `DELETE /api/school-lists/{id}` - Eliminar lista

### 🛍️ **Pedidos** (`/api/orders/*`)
- `GET /api/orders` - Listar pedidos del usuario
- `GET /api/orders/{id}` - Obtener pedido específico
- `POST /api/orders` - Crear nuevo pedido

### 🔧 **Panel de Administración**
- `GET /admin` - Dashboard principal
- `GET /admin/products` - Gestión de productos
- `GET /admin/orders` - Gestión de pedidos
- `GET /admin/users` - Gestión de usuarios
- `GET /admin/institutions` - Gestión de instituciones

### 📄 **Páginas Públicas**
- `GET /` - Página principal (Home)
- `GET /catalogo` - Catálogo de productos
- `GET /producto/{slug}` - Página de producto
- `GET /carrito` - Carrito de compras
- `GET /checkout` - Proceso de checkout
- `GET /lista-utiles` - Listas de útiles escolares
- `GET /blog` - Blog y noticias
- `GET /soporte` - Centro de soporte
- `GET /mi-cuenta` - Panel de usuario
- `GET /perfil` - Editar perfil de usuario

## 📚 **Funcionalidades Implementadas vs Pendientes**

### ✅ **Implementadas (Core MVP)**
- [x] Sistema de autenticación completo
- [x] Gestión de carrito de compras
- [x] Catálogo de productos con filtros
- [x] Búsqueda de productos
- [x] Gestión básica de usuarios
- [x] Estructura de pedidos
- [x] Integración con instituciones
- [x] Listas escolares básicas
- [x] Panel de administración básico

### 🚧 **En Desarrollo (Según to_do.md)**
- [ ] Carrito con reserva de stock (15 min)
- [ ] Integración con Mercado Pago
- [ ] Sistema de envíos por zona/CP
- [ ] Presupuestos desde listas escolares
- [ ] Panel administrativo completo
- [ ] Sistema de notificaciones

### ❌ **Faltan por Implementar**
- [ ] **Sistema de Promociones y Cupones**
  - Modelos: `Promotion`, `Coupon`, `Discount`
  - API: `/api/promotions/*`, `/api/coupons/*`
  - Frontend: Aplicación de cupones en checkout

- [ ] **Sistema de Devoluciones/RMA**
  - Modelos: `Return`, `Refund`, `Exchange`
  - API: `/api/returns/*`, `/api/refunds/*`
  - Frontend: Formulario de devoluciones

- [ ] **Sistema de Notificaciones**
  - Email transaccionales
  - SMS para confirmaciones
  - Push notifications
  - API: `/api/notifications/*`

- [ ] **Sistema de Contenido/Blog**
  - CMS para artículos
  - Categorías de blog
  - API: `/api/blog/*`, `/api/cms/*`

- [ ] **Sistema de Atención al Cliente**
  - Tickets de soporte
  - Chat en vivo
  - WhatsApp Business API
  - API: `/api/tickets/*`, `/api/chat/*`

- [ ] **Sistema de Fidelización**
  - Puntos por compra
  - Programas de referidos
  - Tiers de cliente
  - API: `/api/loyalty/*`

- [ ] **Analytics e Internacionalización**
  - A/B Testing framework
  - Multi-idioma (i18n)
  - Métricas avanzadas

## 🏗️ **Arquitectura de URLs**

### **Páginas del Cliente:**
```
/ (Home)
├── /catalogo (Catálogo con filtros)
├── /producto/[slug] (Detalle de producto)
├── /carrito (Carrito de compras)
├── /checkout (Proceso de pago)
├── /lista-utiles (Listas escolares)
│   ├── /escanear (OCR de listas)
│   ├── /crear (Crear manual)
│   └── /ejemplo (Ver ejemplo)
├── /blog (Contenido)
├── /soporte (Ayuda)
├── /mi-cuenta (Panel usuario)
└── /perfil (Editar perfil)
```

### **Panel de Administración:**
```
/admin (Dashboard)
├── /productos (CRUD productos)
├── /pedidos (Gestión pedidos)
├── /usuarios (Gestión usuarios)
├── /instituciones (Gestión instituciones)
├── /promociones (Gestión promos)
├── /devoluciones (Gestión RMA)
├── /notificaciones (Sistema notificaciones)
└── /analytics (Métricas)
```

### **APIs REST:**
```
/api
├── /auth/* (Autenticación)
├── /products/* (Productos)
├── /cart/* (Carrito)
├── /orders/* (Pedidos)
├── /users/* (Usuarios)
├── /institutions/* (Instituciones)
├── /school-lists/* (Listas escolares)
├── /promotions/* (Promociones)
├── /returns/* (Devoluciones)
├── /notifications/* (Notificaciones)
└── /analytics/* (Métricas)
```

## 📋 **Checklist de Implementación**

### **Alta Prioridad (Próximas 2 semanas):**
- [ ] Documentar reglas de negocio y validaciones
- [ ] Implementar sistema de carrito con reserva de stock
- [ ] Integrar Mercado Pago para pagos
- [ ] Crear panel administrativo completo

### **Media Prioridad (1 mes):**
- [ ] Sistema de promociones y cupones
- [ ] Sistema de devoluciones/RMA
- [ ] Sistema de notificaciones
- [ ] Blog/CMS básico

### **Baja Prioridad (2-3 meses):**
- [ ] Programa de fidelización
- [ ] Chat de atención al cliente
- [ ] Analytics avanzado
- [ ] Internacionalización

## 🔄 **Estado Actual vs Documentado**

### **Base de Datos (Schema ✅)**
- Modelos principales implementados
- Relaciones definidas correctamente
- Índices optimizados

### **API Backend (70% ✅)**
- Autenticación completa
- CRUD productos básico
- Carrito funcional
- Estructura de pedidos

### **Frontend (60% ✅)**
- Navegación responsive
- Catálogo de productos
- Carrito visual
- Autenticación UI

### **Funcionalidades de Negocio (30% ✅)**
- Faltan: Pagos, envíos, promociones
- Faltan: Devoluciones, notificaciones
- Faltan: Analytics, fidelización