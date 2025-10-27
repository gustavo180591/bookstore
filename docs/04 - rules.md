# Reglas de Negocio - Bookstore

## 📋 Reglas y Validaciones del Sistema

### 🔐 **1. Autenticación y Seguridad**

#### **1.1 Reglas de Registro**
- **Email único**: No se permiten emails duplicados
- **Contraseña mínima**: 8 caracteres, 1 mayúscula, 1 número, 1 símbolo
- **DNI/CUIL único**: No se permiten documentos duplicados
- **Validación de email**: Formato válido y dominio existente
- **Activación de cuenta**: Email de verificación (opcional en MVP)

#### **1.2 Reglas de Login**
- **Intentos fallidos**: Máximo 5 intentos por IP por hora
- **Bloqueo temporal**: 15 minutos después de 5 intentos fallidos
- **Sesión timeout**: 24 horas de inactividad máxima
- **Recordar sesión**: 30 días máximo con "Recordarme"

#### **1.3 Reglas de Seguridad**
- **Rate limiting**: 100 requests/minuto por IP
- **Headers de seguridad**: CSRF, CSP, HSTS habilitados
- **Logs de seguridad**: Todos los intentos de login registrados
- **Encriptación**: Todas las contraseñas hasheadas con bcrypt

### 🛒 **2. Carrito de Compras**

#### **2.1 Reglas de Stock**
- **Reserva temporal**: 15 minutos al agregar al carrito
- **Stock en tiempo real**: Actualización inmediata en toda la aplicación
- **Límite por producto**: Máximo 50 unidades por producto por carrito
- **Productos agotados**: No se pueden agregar si stock = 0

#### **2.2 Reglas de Carrito**
- **Expiración automática**: Carritos abandonados se eliminan después de 7 días
- **Mínimo de compra**: $1000 para envíos a domicilio
- **Máximo de productos**: 100 items diferentes por carrito
- **Cálculo de totales**: IVA incluido, descuentos aplicados

### 📦 **3. Productos y Catálogo**

#### **3.1 Reglas de Productos**
- **SKU único**: No se permiten códigos duplicados
- **Precio mínimo**: $10 (para cubrir costos operativos)
- **Precio máximo**: $500,000 (para evitar errores)
- **Stock mínimo**: No se puede tener stock negativo
- **Imágenes requeridas**: Al menos 1 imagen por producto

#### **3.2 Reglas de Categorías**
- **Jerarquía máxima**: 3 niveles de profundidad
- **Categorías activas**: Solo categorías con productos activos se muestran
- **Productos por categoría**: Máximo 500 productos por página

### 🛍️ **4. Pedidos y Checkout**

#### **4.1 Reglas de Pedidos**
- **Número único**: Secuencia automática por año
- **Estados válidos**: PENDIENTE → CONFIRMADO → PAGO_APROBADO → ENVIADO → ENTREGADO
- **Cancelación**: Solo antes de PAGO_APROBADO
- **Modificación**: Solo antes de ENVIADO

#### **4.2 Reglas de Checkout**
- **Validación de datos**: Todos los campos obligatorios completos
- **Stock verification**: Re-verificación antes de confirmar pago
- **Tiempo límite**: 10 minutos para completar checkout
- **Métodos de pago**: Solo Mercado Pago (fase 1)

#### **4.3 Reglas de Envío**
- **Códigos postales válidos**: Solo Argentina continental
- **Zonas permitidas**: Según configuración de la empresa
- **Costo mínimo**: $500 para envíos
- **Tiempo de entrega**: 24-72 horas según zona

### 💰 **5. Pagos y Facturación**

#### **5.1 Reglas de Pagos**
- **Webhook verification**: Firma digital obligatoria de Mercado Pago
- **Estado automático**: Cambio automático basado en webhook
- **Reintentos**: Máximo 3 reintentos para pagos rechazados
- **Comisiones**: 4.99% + IVA de Mercado Pago

#### **5.2 Reglas de Facturación**
- **Factura automática**: Generación automática al PAGO_APROBADO
- **Datos fiscales**: CUIT de la empresa: 30-12345678-9
- **IVA discriminado**: 21% para productos, 10.5% para libros
- **Retención**: Aplicar retenciones según tipo de cliente

### 🏫 **6. Instituciones y Listas Escolares**

#### **6.1 Reglas de Instituciones**
- **CUIT único**: No se permiten instituciones duplicadas
- **Validación de datos**: Email y teléfono requeridos
- **Estados**: ACTIVAS/INACTIVAS (solo activas se muestran)
- **Miembros**: Máximo 10 miembros por institución

#### **6.2 Reglas de Listas Escolares**
- **Grados válidos**: Desde sala de 3 hasta 6to año secundario
- **Productos por lista**: Máximo 200 productos
- **Visibilidad**: PÚBLICA o PRIVADA por institución
- **Vencimiento**: Listas de años anteriores se archivan automáticamente

### 👥 **7. Usuarios y Roles**

#### **7.1 Reglas de Usuarios**
- **Email verification**: Requerido para compras > $5000
- **Datos completos**: Nombre y teléfono requeridos para envíos
- **Direcciones múltiples**: Hasta 5 direcciones por usuario
- **Historial**: Se mantiene por 2 años

#### **7.2 Roles del Sistema**
- **ADMIN**: Acceso total a panel administrativo
- **MANAGER**: Gestión de productos y pedidos
- **CUSTOMER**: Solo compras y perfil personal

#### **7.3 Permisos por Rol**
```javascript
// ADMIN: Todas las operaciones
// MANAGER: CRUD productos, ver pedidos, ver usuarios
// CUSTOMER: CRUD propio perfil, crear pedidos, ver historial
```

### 📧 **8. Notificaciones y Comunicación**

#### **8.1 Email Transaccional**
- **Confirmación de registro**: Inmediata
- **Confirmación de pedido**: Inmediata al crear pedido
- **Confirmación de pago**: Inmediata al PAGO_APROBADO
- **Envío**: 24 horas antes de entrega estimada
- **Recordatorio**: Carritos abandonados después de 24 horas

#### **8.2 SMS Notificaciones**
- **Código de verificación**: Para registros nuevos
- **Confirmación de pago**: Para montos > $10,000
- **Retrasos de envío**: Si hay demoras > 24 horas

### 🏪 **9. Reglas Operativas**

#### **9.1 Horarios de Atención**
- **Ventas online**: 24/7
- **Soporte telefónico**: Lunes a Viernes 9:00-18:00
- **Retiro en local**: Lunes a Sábado 9:00-19:00
- **Procesamiento**: Pedidos hasta las 17:00 salen el mismo día

#### **9.2 Zonas de Envío**
- **Posadas**: Envío gratis > $5000, costo $800 < $5000
- **Zona metropolitana**: +$200 adicional
- **Interior de Misiones**: +$500 adicional
- **Resto del país**: Consultar (no disponible en MVP)

#### **9.3 Políticas de Devolución**
- **Plazo**: 30 días para cambios
- **Condición**: Producto sin uso, con etiquetas
- **Excepciones**: Productos personalizados o de higiene
- **Costo**: Envío por cuenta del cliente (excepto defectos)

### 🔍 **10. Validaciones de Datos**

#### **10.1 Validaciones de Email**
```javascript
// Regex para email válido
/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

// Emails bloqueados (temporales)
['10minutemail.com', 'tempmail.org', 'guerrillamail.com']
```

#### **10.2 Validaciones de DNI/CUIL**
```javascript
// DNI: 7-8 dígitos
/^\d{7,8}$/

// CUIL: XX-XXXXXXXX-X (11 dígitos + guiones)
/^\d{2}-\d{8}-\d$/

// CUIT: XX-XXXXXXXX-X (11 dígitos + guiones)
/^\d{2}-\d{8}-\d$/
```

#### **10.3 Validaciones de Teléfono**
```javascript
// Celular Argentina: +54 9 XXX XXX XXXX
/^\+54\s9\s\d{2}\s\d{3}\s\d{4}$/

// Fijo Argentina: +54 XXX XXX XXXX
/^\+54\s\d{2,4}\s\d{3}\s\d{4}$/
```

#### **10.4 Validaciones de Código Postal**
```javascript
// Argentina: 4 dígitos o 4 dígitos + 3 letras
/^(\d{4}|[A-Z]\d{4}[A-Z]{3})$/

// Zonas válidas para envío
VALID_ZONES = ['3300', '3301', '3302', '3303', '3304']
```

### ⚡ **11. Reglas de Performance**

#### **11.1 Límites de API**
- **Productos por página**: Máximo 50 items
- **Búsqueda**: Máximo 100 resultados
- **Carrito**: Máximo 100 items diferentes
- **Request timeout**: 30 segundos máximo

#### **11.2 Cache Strategy**
- **Productos**: 15 minutos
- **Categorías**: 1 hora
- **Sesión de usuario**: 24 horas
- **Carrito**: 15 minutos (con reserva de stock)

#### **11.3 Base de Datos**
- **Índices críticos**: email, sku, documentNumber, createdAt
- **Consultas complejas**: Máximo 2 segundos
- **Conexiones pool**: 10-50 conexiones concurrentes

### 🚨 **12. Reglas de Error Handling**

#### **12.1 Tipos de Error**
- **400 Bad Request**: Datos inválidos del cliente
- **401 Unauthorized**: Token inválido o expirado
- **403 Forbidden**: Sin permisos para la operación
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Stock insuficiente o reserva expirada
- **429 Too Many Requests**: Rate limiting excedido
- **500 Internal Server Error**: Error del servidor

#### **12.2 Manejo de Errores**
- **Logs detallados**: Todos los errores en database y files
- **User-friendly messages**: Mensajes claros para el usuario
- **Fallback automático**: Reintentar operaciones críticas
- **Alertas**: Notificar al equipo técnico de errores críticos

### 🔒 **13. Reglas de Compliance y Legal**

#### **13.1 Protección de Datos (LPDP)**
- **Consentimiento**: Checkbox explícito para marketing
- **Retención**: Datos por 2 años después de última compra
- **Eliminación**: Proceso automático de datos inactivos
- **Portabilidad**: Exportar datos del usuario en formato JSON

#### **13.2 Facturación Legal**
- **Factura A**: Para empresas con CUIT
- **Factura B**: Para consumidores finales
- **CAE**: Obtener CAE de AFIP automáticamente
- **Retenciones**: Aplicar según régimen de cada cliente

#### **13.3 Términos y Condiciones**
- **Aceptación**: Obligatoria antes del primer pedido
- **Versionado**: Historial de cambios de términos
- **Notificación**: Email automático de cambios importantes

### 📊 **14. Métricas y Monitoreo**

#### **14.1 KPIs Críticos**
- **Tasa de conversión**: Carrito → Pedido → Pago
- **Tiempo de respuesta**: API < 500ms (p95)
- **Disponibilidad**: 99.9% uptime
- **Tasa de error**: < 1% de requests fallidos

#### **14.2 Alertas Automáticas**
- **Stock bajo**: < 5 unidades de producto popular
- **Pagos fallidos**: > 10% de tasa de rechazo
- **Performance**: > 1 segundo de respuesta promedio
- **Errores**: > 5 errores por minuto

### 🔄 **15. Reglas de Estados y Transiciones**

#### **15.1 Estados de Pedido**
```javascript
const ORDER_STATES = {
  PENDIENTE: 'PENDIENTE',           // Creado, sin pago
  CONFIRMADO: 'CONFIRMADO',         // Pago confirmado, stock reservado
  PAGO_APROBADO: 'PAGO_APROBADO',   // Pago exitoso, stock descontado
  EN_PREPARACION: 'EN_PREPARACION', // Empaquetando
  ENVIADO: 'ENVIADO',              // Entregado a transportista
  ENTREGADO: 'ENTREGADO',          // Recibido por cliente
  CANCELADO: 'CANCELADO',          // Cancelado por cliente o admin
  DEVUELTO: 'DEVUELTO'             // Producto devuelto
}
```

#### **15.2 Estados de Pago**
```javascript
const PAYMENT_STATES = {
  PENDIENTE: 'PENDIENTE',     // Esperando pago
  APROBADO: 'APROBADO',       // Pago exitoso
  RECHAZADO: 'RECHAZADO',     // Pago rechazado
  CANCELADO: 'CANCELADO',     // Pago cancelado
  EXPIRADO: 'EXPIRADO',       // Pago expirado
  EN_REVISION: 'EN_REVISION'  // Pago en revisión
}
```

#### **15.3 Transiciones Válidas**
- **PENDIENTE** → CONFIRMADO (al iniciar pago)
- **CONFIRMED** → PAGO_APROBADO (webhook exitoso)
- **PAGO_APROBADO** → EN_PREPARACION (interno)
- **EN_PREPARACION** → ENVIADO (al despachar)
- **ENVIADO** → ENTREGADO (confirmación de entrega)
- **Cualquier estado** → CANCELADO (antes de ENVIADO)

### 🚦 **16. Reglas de Validación Frontend**

#### **16.1 Validación en Tiempo Real**
- **Email**: Formato válido mientras escribe
- **Contraseña**: Fortaleza visual con colores
- **DNI/CUIL**: Validación automática de dígitos
- **Código Postal**: Verificación de zona de envío

#### **16.2 UX Guidelines**
- **Mensajes de error**: Específicos y accionables
- **Estados de loading**: En todas las operaciones async
- **Feedback visual**: Confirmación de acciones exitosas
- **Progreso**: Indicadores en procesos multi-step

### 🔧 **17. Reglas de Configuración**

#### **17.1 Variables de Entorno**
```env
# Database
DATABASE_URL=postgresql://...

# Mercado Pago
MP_PUBLIC_KEY=...
MP_ACCESS_TOKEN=...
MP_WEBHOOK_SECRET=...

# Email
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

# Security
JWT_SECRET=...
ENCRYPTION_KEY=...

# Business Rules
MIN_ORDER_AMOUNT=1000
MAX_CART_ITEMS=100
STOCK_RESERVATION_MINUTES=15
```

#### **17.2 Configuración de Envíos**
```javascript
const SHIPPING_ZONES = {
  '3300': { name: 'Posadas', cost: 0, freeFrom: 5000 },
  '3301': { name: 'Garupá', cost: 200, freeFrom: 5000 },
  '3302': { name: 'Fachinal', cost: 500, freeFrom: 8000 }
}
```

#### **17.3 Configuración de Productos**
```javascript
const PRODUCT_RULES = {
  minPrice: 10,
  maxPrice: 500000,
  maxStock: 10000,
  maxImages: 10,
  allowedCategories: ['libreria', 'libros', 'tecnologia', 'arte']
}
```

## 📋 **Checklist de Reglas Implementadas**

### **✅ Completamente Implementadas**
- [x] Validaciones básicas de formulario
- [x] Estados de usuario y sesión
- [x] Estructura de pedidos y pagos
- [x] Validaciones de email y documentos
- [x] Jerarquía de roles y permisos

### **🚧 En Implementación**
- [ ] Reserva de stock en carrito
- [ ] Validaciones de checkout completas
- [ ] Webhooks de Mercado Pago
- [ ] Sistema de notificaciones

### **❌ Faltan por Implementar**
- [ ] **Reglas de Promociones**
  - Códigos de descuento
  - Descuentos por categoría
  - Promociones por volumen

- [ ] **Reglas de Devoluciones**
  - Plazos de devolución
  - Estados de RMA
  - Políticas de reembolso

- [ ] **Reglas de Fidelización**
  - Cálculo de puntos
  - Niveles de cliente
  - Beneficios por tier

- [ ] **Reglas de Envío Avanzadas**
  - Cálculo dinámico de costos
  - Restricciones por producto
  - Tiempos de entrega por zona

## 🎯 **Próximos Pasos Críticos**

1. **Implementar reserva de stock** en carrito (15 min timeout)
2. **Integrar Mercado Pago** con webhooks seguros
3. **Desarrollar reglas de envío** por código postal
4. **Crear sistema de validaciones** en checkout
5. **Documentar reglas de promociones** para futura implementación