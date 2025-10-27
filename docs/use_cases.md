# Casos de Uso - Bookstore

## 🎯 User Stories y Casos de Uso Detallados

### 👤 **1. Usuarios Finales (Clientes)**

#### **1.1 Compra de Útiles Escolares**
**Como** cliente que necesita útiles escolares
**Quiero** poder buscar y comprar productos por lista escolar
**Para** tener todo lo necesario para el ciclo lectivo

**Escenario:**
1. Cliente accede a la página principal
2. Navega a "Lista de Útiles" en el menú
3. Ve opciones: Escanear lista, Crear manual, Ver ejemplo
4. Elige "Ver lista de ejemplo" para entender el proceso
5. Sube foto de lista escolar o crea manualmente
6. Sistema procesa y muestra productos disponibles
7. Agrega productos al carrito
8. Completa checkout con pago
9. Recibe confirmación y tracking

**Criterios de Aceptación:**
- [x] Proceso completo de OCR para listas escolares
- [x] Matching automático con catálogo de productos
- [x] Sugerencias de productos alternativos
- [x] Precios actualizados en tiempo real
- [x] Stock verificado antes de checkout

#### **1.2 Compra Individual de Productos**
**Como** cliente que necesita productos específicos
**Quiero** buscar y comprar items individuales
**Para** complementar mis necesidades

**Escenario:**
1. Cliente usa barra de búsqueda
2. Aplica filtros por categoría, precio, marca
3. Ve productos con imágenes y detalles
4. Selecciona variantes (color, tamaño)
5. Ve stock disponible en tiempo real
6. Agrega al carrito con cantidad deseada
7. Continúa comprando o va a checkout

**Criterios de Aceptación:**
- [x] Búsqueda con filtros avanzados
- [x] Vista de galería con zoom de imágenes
- [x] Información detallada de productos
- [x] Stock en tiempo real por variante
- [x] Carrito persistente entre sesiones

#### **1.3 Seguimiento de Pedidos**
**Como** cliente que realizó una compra
**Quiero** poder trackear mi pedido
**Para** saber cuándo recibiré mis productos

**Escenario:**
1. Cliente inicia sesión en su cuenta
2. Va a "Mis pedidos" en el menú
3. Ve lista de pedidos con estados
4. Selecciona pedido específico
5. Ve timeline con estados y fechas
6. Recibe notificaciones de cambios

**Criterios de Aceptación:**
- [x] Estados de pedido en tiempo real
- [x] Notificaciones push y email
- [x] Timeline visual de progreso
- [x] Información de envío y tracking
- [x] Contacto con atención al cliente

### 🏫 **2. Instituciones Educativas**

#### **2.1 Gestión de Listas Institucionales**
**Como** representante de una institución educativa
**Quiero** crear y gestionar listas de útiles por grado
**Para** facilitar las compras a familias y alumnos

**Escenario:**
1. Representante se registra como institución
2. Crea cuenta institucional con datos de la escuela
3. Crea listas por grado/año
4. Comparte listas con familias
5. Familias pueden comprar directamente
6. Institución recibe comisiones o beneficios

**Criterios de Aceptación:**
- [x] Proceso de onboarding institucional
- [x] Gestión de listas por grado
- [x] Compartir listas públicas/privadas
- [x] Tracking de compras por lista
- [x] Reportes para instituciones

#### **2.2 Compra Institucional a Granel**
**Como** institución que necesita grandes cantidades
**Quiero** hacer pedidos al por mayor
**Para** surtir toda la institución

**Escenario:**
1. Contacta con el equipo comercial
2. Recibe cotización personalizada
3. Negocia precios y condiciones
4. Realiza pedido con condiciones especiales
5. Recibe entrega programada
6. Gestiona facturación institucional

**Criterios de Aceptación:**
- [x] Proceso de cotización personalizado
- [x] Precios diferenciados por volumen
- [x] Entregas programadas
- [x] Facturación para instituciones
- [x] Soporte dedicado

### 🏪 **3. Administradores del Sistema**

#### **3.1 Gestión de Catálogo de Productos**
**Como** administrador del sistema
**Quiero** gestionar el catálogo completo
**Para** mantener productos actualizados

**Escenario:**
1. Accede al panel de administración
2. Va a sección de productos
3. Ve lista con filtros y búsqueda
4. Crea nuevo producto con variantes
5. Sube imágenes y completa información
6. Establece precios y stock
7. Publica producto en catálogo

**Criterios de Aceptación:**
- [x] CRUD completo de productos
- [x] Gestión de variantes (tamaño, color)
- [x] Carga masiva de productos
- [x] Gestión de imágenes múltiple
- [x] Control de stock por variante

#### **3.2 Gestión de Pedidos y Envíos**
**Como** administrador operativo
**Quiero** gestionar pedidos y envíos
**Para** asegurar entregas exitosas

**Escenario:**
1. Accede a dashboard de pedidos
2. Ve pedidos pendientes de procesar
3. Revisa stock disponible
4. Confirma pedido y reserva stock
5. Coordina con transportista
6. Actualiza estado de envío
7. Procesa entregas y confirmaciones

**Criterios de Aceptación:**
- [x] Dashboard con estados de pedidos
- [x] Gestión de reservas de stock
- [x] Integración con transportistas
- [x] Tracking de envíos
- [x] Reportes de entregas

#### **3.3 Análisis de Ventas y Performance**
**Como** gerente de la tienda
**Quiero** ver métricas y reportes
**Para** tomar decisiones de negocio

**Escenario:**
1. Accede a dashboard ejecutivo
2. Ve KPIs principales (ventas, conversion)
3. Analiza productos más vendidos
4. Revisa métricas de clientes
5. Exporta reportes para análisis
6. Configura alertas automáticas

**Criterios de Aceptación:**
- [x] Dashboard con KPIs en tiempo real
- [x] Reportes exportables
- [x] Alertas automáticas
- [x] Métricas de conversión
- [x] Análisis de comportamiento

### 🤖 **4. Procesos Automatizados**

#### **4.1 Procesamiento de Listas Escolares**
**Como** sistema automatizado
**Quiero** procesar listas escolares subidas
**Para** generar presupuestos automáticos

**Escenario:**
1. Cliente sube imagen de lista escolar
2. Sistema OCR extrae texto
3. AI hace matching con productos
4. Genera presupuesto con productos disponibles
5. Muestra alternativas si no hay stock
6. Permite ajustes manuales

**Criterios de Aceptación:**
- [x] OCR preciso para listas escolares
- [x] Matching automático con catálogo
- [x] Sugerencias inteligentes
- [x] Precios actualizados
- [x] Edición manual si es necesario

#### **4.2 Gestión Automática de Stock**
**Como** sistema de inventario
**Quiero** gestionar stock automáticamente
**Para** prevenir sobreventas

**Escenario:**
1. Cliente agrega producto al carrito
2. Sistema reserva stock por 15 minutos
3. Si completa compra, descuenta stock
4. Si expira reserva, libera stock
5. Envía alertas de stock bajo
6. Sugiere reorden automático

**Criterios de Aceptación:**
- [x] Reserva temporal de stock
- [x] Liberación automática de reservas
- [x] Alertas de stock bajo
- [x] Prevención de sobreventas
- [x] Reportes de movimientos

### 📱 **5. Casos de Uso Móviles**

#### **5.1 Compra desde Móvil**
**Como** usuario móvil
**Quiero** comprar fácilmente desde mi teléfono
**Para** hacer pedidos en cualquier momento

**Escenario:**
1. Accede desde navegador móvil
2. Navegación optimizada para touch
3. Búsqueda con sugerencias
4. Carrito accesible desde cualquier página
5. Checkout simplificado para móvil
6. Pago con métodos móviles

**Criterios de Aceptación:**
- [x] Responsive design completo
- [x] Touch-friendly interface
- [x] Checkout optimizado para móvil
- [x] Métodos de pago móviles
- [x] Notificaciones push

#### **5.2 Atención al Cliente por WhatsApp**
**Como** cliente que necesita soporte
**Quiero** contactar por WhatsApp
**Para** resolver consultas rápidamente

**Escenario:**
1. Ve botón de WhatsApp en sitio
2. Inicia conversación automáticamente
3. Recibe respuesta de bot inicial
4. Deriva a humano si es necesario
5. Recibe actualizaciones de pedido
6. Califica la atención recibida

**Criterios de Aceptación:**
- [x] Integración WhatsApp Business
- [x] Bot inicial automatizado
- [x] Derivación a humanos
- [x] Tracking de conversaciones
- [x] Métricas de satisfacción

### 🛒 **6. Flujos de Checkout**

#### **6.1 Checkout como Invitado**
**Como** cliente ocasional
**Quiero** comprar sin registrarme
**Para** no perder tiempo en formularios

**Escenario:**
1. Agrega productos al carrito
2. Va a checkout y elige "Continuar como invitado"
3. Completa datos básicos (email, nombre, teléfono)
4. Ingresa dirección de envío
5. Elige método de pago
6. Confirma compra
7. Recibe confirmación por email

**Criterios de Aceptación:**
- [x] Proceso simplificado para invitados
- [x] Validación mínima de datos
- [x] Confirmación por email
- [x] Opción de crear cuenta después
- [x] Recuperación de pedidos por email

#### **6.2 Checkout con Cuenta**
**Como** cliente registrado
**Quiero** un checkout rápido
**Para** aprovechar mis datos guardados

**Escenario:**
1. Inicia sesión en su cuenta
2. Carrito se carga automáticamente
3. Selecciona dirección guardada
4. Elige método de pago preferido
5. Revisa resumen de pedido
6. Confirma con un click
7. Recibe confirmación inmediata

**Criterios de Aceptación:**
- [x] Direcciones guardadas
- [x] Métodos de pago guardados
- [x] Checkout en 3 pasos máximo
- [x] Resumen claro antes de pagar
- [x] Confirmación inmediata

### 🎁 **7. Sistema de Promociones**

#### **7.1 Aplicación de Cupones**
**Como** cliente con código promocional
**Quiero** aplicar descuento en mi compra
**Para** obtener mejor precio

**Escenario:**
1. Ve campo "Código promocional" en carrito
2. Ingresa código de descuento
3. Sistema valida código automáticamente
4. Ve descuento aplicado en resumen
5. Completa compra con precio reducido
6. Recibe confirmación del descuento

**Criterios de Aceptación:**
- [x] Validación automática de códigos
- [x] Aplicación inmediata de descuentos
- [x] Códigos únicos y de un solo uso
- [x] Restricciones por producto/categoría
- [x] Fecha de expiración

#### **7.2 Programa de Fidelización**
**Como** cliente recurrente
**Quiero** acumular puntos y beneficios
**Para** obtener ventajas exclusivas

**Escenario:**
1. Se registra en programa de puntos
2. Acumula puntos por cada compra
3. Ve progreso hacia siguiente nivel
4. Canjea puntos por descuentos
5. Recibe beneficios exclusivos
6. Comparte código de referido

**Criterios de Aceptación:**
- [x] Sistema de puntos automático
- [x] Niveles de cliente (Bronze, Silver, Gold)
- [x] Canje de puntos por beneficios
- [x] Programa de referidos
- [x] Dashboard de puntos personal

### 📞 **8. Atención al Cliente**

#### **8.1 Chat en Vivo**
**Como** cliente con consulta
**Quiero** chatear en tiempo real
**Para** resolver dudas inmediatamente

**Escenario:**
1. Ve widget de chat en sitio web
2. Inicia conversación con pregunta
3. Recibe respuesta de bot automático
4. Si necesita humano, se deriva
5. Resuelve consulta completamente
6. Califica la atención recibida

**Criterios de Aceptación:**
- [x] Chat widget integrado
- [x] Bot inicial automatizado
- [x] Derivación automática a humanos
- [x] Historial de conversaciones
- [x] Métricas de tiempo de respuesta

#### **8.2 Sistema de Tickets**
**Como** cliente con problema complejo
**Quiero** crear ticket de soporte
**Para** seguimiento formal de mi consulta

**Escenario:**
1. Accede a centro de soporte
2. Elige categoría de problema
3. Completa formulario detallado
4. Recibe número de ticket
5. Recibe actualizaciones por email
6. Resolución con satisfacción

**Criterios de Aceptación:**
- [x] Sistema de tickets categorizado
- [x] Formularios específicos por problema
- [x] Seguimiento automático por email
- [x] SLA de respuesta según prioridad
- [x] Base de conocimiento integrada

### 🔄 **9. Procesos Administrativos**

#### **9.1 Gestión de Devoluciones**
**Como** administrador de tienda
**Quiero** procesar devoluciones
**Para** mantener clientes satisfechos

**Escenario:**
1. Cliente solicita devolución
2. Revisa política de devoluciones
3. Aprueba/rechaza según condiciones
4. Procesa reembolso si corresponde
5. Actualiza stock si aplica
6. Registra caso para análisis

**Criterios de Aceptación:**
- [x] Workflow completo de RMA
- [x] Políticas automáticas por producto
- [x] Procesamiento de reembolsos
- [x] Actualización automática de stock
- [x] Reportes de devoluciones

#### **9.2 Análisis de Ventas**
**Como** gerente de la tienda
**Quiero** analizar performance de ventas
**Para** tomar decisiones informadas

**Escenario:**
1. Accede a dashboard de analytics
2. Ve métricas principales en tiempo real
3. Analiza productos más vendidos
4. Identifica tendencias y patrones
5. Exporta reportes para análisis
6. Configura alertas automáticas

**Criterios de Aceptación:**
- [x] Dashboard con KPIs en tiempo real
- [x] Reportes exportables
- [x] Análisis de tendencias
- [x] Alertas automáticas
- [x] Métricas de conversión

## 📋 **Matriz de Casos de Uso por Prioridad**

### **🔥 Críticos (MVP)**
- [x] Compra básica de productos
- [x] Autenticación y registro
- [x] Carrito de compras
- [x] Checkout con Mercado Pago
- [x] Seguimiento de pedidos

### **⚡ Importantes (3 meses)**
- [ ] Procesamiento de listas escolares
- [ ] Sistema de promociones
- [ ] Gestión de devoluciones
- [ ] Notificaciones automáticas
- [ ] Atención al cliente

### **🧭 Secundarios (6 meses)**
- [ ] Programa de fidelización
- [ ] Integración marketplaces
- [ ] Analytics avanzado
- [ ] API pública
- [ ] Omnicanal

## 🎯 **Métricas de Éxito por Caso de Uso**

### **Conversión:**
- Tasa de conversión carrito → pedido: > 60%
- Tasa de conversión visitante → carrito: > 15%
- Tasa de finalización de checkout: > 80%

### **Performance:**
- Tiempo de carga de páginas: < 2 segundos
- Tiempo de respuesta de API: < 500ms
- Disponibilidad del sistema: 99.9%

### **Satisfacción:**
- NPS (Net Promoter Score): > 7/10
- Tiempo de respuesta soporte: < 2 horas
- Tasa de resolución primer contacto: > 70%

### **Negocio:**
- Valor promedio de pedido: $2,500
- Frecuencia de compra: 2.5 veces/año
- Tasa de retención: > 65%
- Costo de adquisición: < $50

## 🔄 **Flujos de Usuario Principales**

### **Flujo de Compra Completo:**
```
Landing → Búsqueda/Filtros → Producto → Carrito → Checkout → Pago → Confirmación → Seguimiento
```

### **Flujo de Lista Escolar:**
```
Lista Escolar → OCR/Subida → Matching → Carrito → Checkout → Entrega → Satisfacción
```

### **Flujo de Atención al Cliente:**
```
Consulta → Chat/Ticket → Resolución → Seguimiento → Cierre → Feedback
```

## 📚 **Documentación Relacionada**
- **Historia del Proyecto**: `01 - historia.md`
- **Esquema de Base de Datos**: `02 - schema.md`
- **API Routes**: `03 - routes.md`
- **Business Rules**: `04 - rules.md`
- **Roles y Permisos**: `05 - roles-tecnicos-ejecutivos.md`
- **Roadmap**: `06 - roadmap.md`
- **Cliente Requirements**: `cliente.md`
