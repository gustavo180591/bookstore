# To-Do Proyecto Bookstore

## Hoy (P1🔥)
- [x] Configurar migraciones iniciales de Prisma — Crear tablas base (User, Product, Order) en PostgreSQL — Owner: Dev Backend — ETA: Hoy — Link: (pendiente)
  - Ejecutar `npx prisma migrate dev --name init` para aplicar schema.
  - Verificar conexión con Docker: `docker-compose logs db`.
- [x] Implementar endpoints básicos de API — GET /api/products y POST /api/auth/login — Owner: Dev Backend — ETA: Hoy — Link: (pendiente)
  - Criterios: Respuesta JSON válida, manejo de errores básico.

## Esta Semana (P2⚡)
- [ ] Desarrollar catálogo de productos — Página navegable con filtros (categoría, precio) usando TanStack Query — Owner: Dev Frontend — ETA: 2 días — Link: (pendiente)
  - Criterios: Listar productos desde API, paginación, búsqueda.
  - Relacionado: Modelo `Product` en schema.prisma.
- [ ] Implementar carrito de compras — Agregar/remover items con reserva de stock 15' — Owner: Dev Frontend — ETA: 3 días — Link: (pendiente)
  - Criterios: Integrar con `Cart` y `CartItem`, expiración automática.
  - Comando útil: `npm run dev` para probar en SvelteKit.
- [ ] Integrar pagos con Mercado Pago — Webhook para confirmar pagos y actualizar `Payment` — Owner: Dev Backend — ETA: 4 días — Link: (pendiente)
  - Criterios: Procesar pagos, actualizar estado de `Order` a PAGO_APROBADO.
  - Relacionado: Modelos `Order` y `Payment` en schema.prisma.
- [ ] Configurar envíos por zona/CP — Calcular costos basado en `Address` — Owner: Dev Backend — ETA: 5 días — Link: (pendiente)
  - Criterios: Integrar con `ShippingCarrier`, validar códigos postales.

## Backlog (P3🧭)
- [ ] Desarrollar presupuestos desde listas escolares — Pipeline OCR para procesar listas y generar `Budget` — Owner: Dev Fullstack — ETA: Próxima semana — Link: (pendiente)
  - Relacionado: Modelos `SchoolList`, `Institution`.
- [ ] Panel administrativo básico — CRUD para productos e instituciones — Owner: Dev Frontend — ETA: 2 semanas — Link: (pendiente)
- [ ] Mejorar accesibilidad a AA — Audit con herramientas como axe-core — Owner: Dev Frontend — ETA: 2 semanas — Link: (pendiente)
- [ ] Optimizar rendimiento API — Implementar rate limiting y caché en Redis — Owner: Dev Backend — ETA: 3 semanas — Link: (pendiente)

## Bloqueadas (⛔)
- (sin items)

## Decisiones & Supuestos
- **2023-10-14**: Usar Prisma 5 con PostgreSQL para ORM, asumiendo Docker ya configurado.
- **2023-10-14**: Integrar Mercado Pago para pagos, priorizando webhooks seguros.
- **2023-10-14**: Reserva de stock limitada a 15 minutos para evitar bloqueos largos.
- **2023-10-14**: Enfoque MVP en catálogo y checkout; extras como OCR en backlog.

## Riesgos & Mitigaciones
| Riesgo | Mitigación |
|--------|------------|
| Demoras en integración de pagos MP | Probar con sandbox de MP temprano; documentar fallbacks. |
| Problemas de rendimiento en consultas | Implementar índices en Prisma (`@@index`) y monitorear con logs. |
| Dependencias de terceros (n8n/MCP) | Usar versiones estables; tener plan B con herramientas internas. |

## Checklist de Release
- [ ] **Frontend**: Páginas de catálogo y carrito funcionales en SvelteKit.
- [ ] **API**: Endpoints de productos, auth y pagos desplegados.
- [ ] **DB**: Migraciones aplicadas en PostgreSQL vía Docker.
- [ ] **Pagos**: Webhook de Mercado Pago verificado y probado.
- [ ] **Envíos**: Lógica de costos integrada con zonas/CP.

## Changelog Breve
- **2023-10-14**: Configuración inicial de Prisma y Docker; schema definido con modelos base.
