# Panel de Administración - Librería Arco Iris

## Tabla de Contenidos
1. [Estructura del Panel](#1-estructura-del-panel-de-administración)
2. [Módulos Principales](#2-módulos-principales)
3. [Guía de Implementación](#3-guía-de-implementación)
4. [API Endpoints](#4-api-endpoints)
5. [Mejoras Futuras](#5-mejoras-futuras)

## 1. Estructura del Panel de Administración

```
src/routes/admin/
├── productos/               # Gestión de productos
│   ├── +page.svelte        # Listado de productos (existente)
│   ├── nuevo/              # Crear nuevo producto
│   │   └── +page.svelte
│   └── editar/             # Editar producto existente
│       └── [id]/
│           └── +page.svelte
├── categorias/             # Gestión de categorías
│   ├── +page.svelte
│   └── [id]/
│       └── +page.svelte
├── pedidos/                # Gestión de pedidos
│   └── +page.svelte
└── usuarios/               # Gestión de usuarios
    └── +page.svelte
```

## 2. Módulos Principales

### 2.1 Gestión de Productos
- **Listado de productos** (Implementado)
  - Paginación
  - Búsqueda
  - Filtros por categoría/estado
- **Formulario de producto**
  - Campos básicos (nombre, descripción, precio, stock)
  - Galería de imágenes
  - Variantes (tamaños, colores)
  - SEO y metadatos

### 2.2 Gestión de Categorías
- Árbol de categorías
- Ordenamiento por arrastrar y soltar
- Asignación masiva de productos

### 2.3 Gestión de Pedidos
- Listado con filtros avanzados
- Vista detallada de pedido
- Actualización de estado
- Historial de cambios

## 3. Guía de Implementación

### 3.1 Configuración Inicial

1. **Variables de Entorno**
   ```env
   # .env
   ADMIN_EMAIL=admin@libreriaarcoiris.com
   ADMIN_PASSWORD=tu_contraseña_segura
   JWT_SECRET=tu_jwt_secreto
   ```

2. **Dependencias Necesarias**
   ```bash
   npm install @sveltejs/kit @sveltejs/adapter-node
   npm install -D typescript @types/node
   ```

### 3.2 Componentes Principales

#### ProductForm.svelte
```svelte
<script lang="ts">
  export let product: Product | null = null;
  export let onSave: (data: ProductFormData) => Promise<void>;
  
  // Lógica del formulario...
</script>

<!-- Formulario de producto -->
```

#### DataTable.svelte
```svelte
<script lang="ts">
  export let columns: TableColumn[];
  export let data: any[];
  export let onEdit: (item: any) => void;
  export let onDelete: (item: any) => void;
</script>

<!-- Tabla con ordenamiento y paginación -->
```

## 4. API Endpoints

### Productos
```http
GET    /api/admin/products      # Listar productos
POST   /api/admin/products      # Crear producto
GET    /api/admin/products/:id  # Obtener producto
PUT    /api/admin/products/:id  # Actualizar producto
DELETE /api/admin/products/:id  # Eliminar producto
```

### Categorías
```http
GET    /api/admin/categories
POST   /api/admin/categories
# ... otros endpoints
```

## 5. Mejoras Futuras

### Prioridad Alta
- [ ] Sistema de autenticación y autorización
- [ ] Formulario de productos con validaciones
- [ ] Subida de imágenes a Cloud Storage

### Prioridad Media
- [ ] Filtros avanzados en listados
- [ ] Exportación a Excel/CSV
- [ ] Panel de estadísticas

### Prioridad Baja
- [ ] Sistema de notificaciones
- [ ] Integración con pasarelas de pago
- [ ] Soporte multi-idioma

---

## Guía de Contribución

1. Hacer fork del repositorio
2. Crear una rama para la característica (`feature/nombre-caracteristica`)
3. Hacer commit de los cambios
4. Hacer push a la rama
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
