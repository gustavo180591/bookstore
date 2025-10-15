// -----------------------------------------------------------------------------
// schema.prisma — Proyecto: bookstore (e-commerce librería + libros, AR)
// DB: PostgreSQL | Prisma >=5.x
// -----------------------------------------------------------------------------

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ================================ ENUMS ======================================

enum Role {
  ADMIN
  MANAGER
  CUSTOMER
}

enum Currency {
  ARS
  USD
}

enum DocumentTypeAR {
  DNI
  CUIL
  CUIT
}

enum ProvinceAR {
  BUENOS_AIRES
  CATAMARCA
  CHACO
  CHUBUT
  CORDOBA
  CORRIENTES
  ENTRE_RIOS
  FORMOSA
  JUJUY
  LA_PAMPA
  LA_RIOJA
  MENDOZA
  MISIONES
  NEUQUEN
  RIO_NEGRO
  SALTA
  SAN_JUAN
  SAN_LUIS
  SANTA_CRUZ
  SANTA_FE
  SANTIAGO_DEL_ESTERO
  TIERRA_DEL_FUEGO
  TUCUMAN
  CABA
}

enum OrderStatus {
  CREADO
  PAGO_PENDIENTE
  PAGO_APROBADO
  PREPARANDO
  DESPACHADO
  ENTREGADO
  CANCELADO
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  PAID
  PARTIALLY_REFUNDED
  REFUNDED
  FAILED
  CANCELED
}

enum PaymentProvider {
  MERCADO_PAGO
  TRANSFERENCIA
}

enum ShippingCarrier {
  ANDREANI
  OCA
  CORREO_ARG
  MERCADO_ENVIOS
  RETIRO_EN_LOCAL
}

enum AddressType {
  BILLING
  SHIPPING
}

enum MediaType {
  IMAGE
  VIDEO
  PDF
  OTHER
}

enum DiscountType {
  PERCENT
  FIXED_AMOUNT
  FREE_SHIPPING
}

// ================================ USERS ======================================

model User {
  id             String         @id @default(cuid())
  email          String         @unique
  passwordHash   String
  role           Role           @default(CUSTOMER)

  // Identidad (🇦🇷) — DNI obligatorio
  documentType   DocumentTypeAR @default(DNI)
  documentNumber String         @db.VarChar(20) // DNI/CUIT/CUIL
  firstName      String?        @db.VarChar(80)
  lastName       String?        @db.VarChar(80)
  phone          String?        @db.VarChar(30)

  // Relaciones
  addresses      Address[]
  carts          Cart[]
  orders         Order[]
  payments       Payment[]
  budgets        Budget[]
  institutions   InstitutionMember[]

  // Preferencias
  acceptsMarketing Boolean @default(false)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([email])
  @@index([documentNumber])
}

// ================================ INSTITUCIONES ===============================

model Institution {
  id          String               @id @default(cuid())
  name        String
  cuit        String?              @db.VarChar(20)
  phone       String?              @db.VarChar(30)
  email       String?              @db.VarChar(120)
  addressId   String?              @unique
  address     Address?             @relation("InstitutionAddress")

  members     InstitutionMember[]
  schoolLists SchoolList[]
  budgets     Budget[]             // presupuestos institucionales (opcional)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([name])
}

model InstitutionMember {
  id            String       @id @default(cuid())
  institutionId String
  institution   Institution  @relation(fields: [institutionId], references: [id], onDelete: Cascade)
  userId        String
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  roleLabel     String?      @db.VarChar(80) // Ej.: Compras, Rectoría

  @@unique([institutionId, userId])
}

// ================================ DIRECCIONES =================================

model Address {
  id         String       @id @default(cuid())
  userId     String?
  user       User?        @relation(fields: [userId], references: [id], onDelete: SetNull)
  institutionId String? @unique @map("institution_id")
  institution Institution? @relation("InstitutionAddress", fields: [institutionId], references: [id])
  orderId    String? @unique @map("order_id")
  order      Order?       @relation("OrderAddress", fields: [orderId], references: [id])
  type       AddressType
  fullName   String
  phone      String?      @db.VarChar(30)
  street     String
  number     String?      @db.VarChar(10)
  floor      String?      @db.VarChar(10)
  apartment  String?      @db.VarChar(10)
  city       String
  province   ProvinceAR
  postalCode String       @db.VarChar(10)
  extraInfo  String?      @db.VarChar(255)

  @@index([userId])
  @@index([institutionId])
}

// ================================ CARRITOS ===================================

model Cart {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model CartItem {
  id        String    @id @default(cuid())
  cartId    String
  cart      Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int       @default(1)

  @@index([cartId])
}

model Product {
  id          String      @id @default(cuid())
  name        String
  description String?
  price       Decimal     @db.Decimal(10,2)
  stock       Int         @default(0)
  sku         String?     @unique
  category    String?
  imageUrl    String?
  isActive    Boolean     @default(true)

  // Relaciones
  cartItems   CartItem[]
  orderItems  OrderItem[]
  schoolLists SchoolListItem[]
  budgetItems BudgetItem[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([name])
  @@index([category])
}

// ================================ PEDIDOS ====================================

model Order {
  id              String       @id @default(cuid())
  userId          String
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  status          OrderStatus  @default(CREADO)
  total           Decimal      @db.Decimal(10,2)
  currency        Currency     @default(ARS)
  shippingAddressId String?              @unique
  shippingAddress Address?     @relation("OrderAddress")
  shippingCarrier ShippingCarrier @default(RETIRO_EN_LOCAL)
  shippingCost    Decimal      @db.Decimal(10,2) @default(0)
  notes           String?

  // Relaciones
  items           OrderItem[]
  payments        Payment[]
  budgets         Budget[]     // Si aplica

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
  @@index([status])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int
  price     Decimal @db.Decimal(10,2)

  @@index([orderId])
}

// ================================ PAGOS ======================================

model Payment {
  id              String         @id @default(cuid())
  orderId         String
  order           Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  userId          String
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  amount          Decimal        @db.Decimal(10,2)
  currency        Currency       @default(ARS)
  status          PaymentStatus  @default(PENDING)
  provider        PaymentProvider
  externalId      String?        // ID de MercadoPago u otro
  paidAt          DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([orderId])
  @@index([userId])
  @@index([status])
}

// ================================ PRESUPUESTOS ================================

model Budget {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  institutionId String?
  institution   Institution? @relation(fields: [institutionId], references: [id], onDelete: SetNull)
  title         String
  description   String?
  total         Decimal  @db.Decimal(10,2) @default(0)
  currency      Currency @default(ARS)
  status        String   @default("PENDING") // PENDING, APPROVED, REJECTED

  // Relaciones
  items         BudgetItem[]
  orders        Order[] // Si se convierte en pedido

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
  @@index([institutionId])
}

model BudgetItem {
  id        String  @id @default(cuid())
  budgetId  String
  budget    Budget  @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int
  price     Decimal @db.Decimal(10,2)

  @@index([budgetId])
}

// ================================ LISTAS ESCOLARES ============================

model SchoolList {
  id            String   @id @default(cuid())
  institutionId String
  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)
  name          String
  grade         String?  // Grado o curso
  year          Int      // Año lectivo

  // Relaciones
  items         SchoolListItem[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([institutionId])
}

model SchoolListItem {
  id          String     @id @default(cuid())
  schoolListId String
  schoolList   SchoolList @relation(fields: [schoolListId], references: [id], onDelete: Cascade)
  productId   String
  product     Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity    Int
  notes       String?

  @@index([schoolListId])
}
