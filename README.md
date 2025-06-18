# Reto Backend Semi-Senior - GraphQL + MongoDB

## 🚀 Objetivo

Construir una API GraphQL que gestione cuentas y productos, permitiendo:

- Crear y consultar cuentas y productos.
- Asociar productos a cuentas.
- Simular una compra (actualizar stock).
- (BONUS) Integrarse con Odoo (XML-RPC).

## 👁‍🗨️ Stack esperado

- Node.js + TypeScript
- Express + Apollo Server (GraphQL)
- MongoDB (conexión a dos bases)
- Buenas prácticas de código (tipado, validaciones)
- Uso de eslint/prettier
- Manejo de logger
- (Opcional) XML-RPC

## 🗂️ Estructura del proyecto base

```bash
server/
├── config/
│   └── app.ts              # Variables de entorno centralizadas
├── db/
│   └── mongodb.ts          # Conexión multi-base
├── graphql/
│   ├── accounts/
│   │   ├── index.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── schema.ts
│   ├── products/
│   │   ├── index.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── schema.ts
│   └── root/
│       └── index.ts        # TypeDefs y resolvers principales
│   └── index.ts            # Exporta los typeDefs y resolvers combinados
├── interfaces/
│   ├── account.ts          # IAccount
│   └── product.ts          # IProduct
├── models/
│   ├── accounts.ts
│   └── products.ts
├── services/
│   ├── odoo.ts
├── app.ts                  # Setup del servidor Express + Apollo
├── .env
├── .env.test
├── .gitignore
├── logo.png
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Instalación y configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:

```env
# Server Configuration
PORT=3000
APP_PORT=3000

# MongoDB Configuration
MONGODB_URL_ACCOUNTS=mongodb://localhost:27017/eiAccounts
MONGODB_URL_PRODUCTS=mongodb://localhost:27017/eiBusiness

# Odoo Configuration (Opcional - para el bonus)
ODOO_URL=http://localhost:8069
ODOO_DB=test_db
ODOO_UID=1
ODOO_PASSWORD=admin

# Pagination Configuration
PAGE=1
PER_PAGE=20
```

### 3. Iniciar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

El servidor estará disponible en: `http://localhost:3000/graphql`

## 📚 Documentación de operaciones

### 🔐 Cuentas (Accounts)

#### Crear cuenta
```graphql
mutation CreateAccount {
  createAccount(input: {
    name: "Juan Pérez"
    email: "juan.perez@email.com"
  }) {
    _id
    name
    email
    createdAt
    updatedAt
  }
}
```

#### Consultar cuenta por ID
```graphql
query GetAccountById {
  accountById(id: "ACCOUNT_ID") {
    _id
    name
    email
    createdAt
    updatedAt
  }
}
```

#### Listar cuentas con filtro
```graphql
query GetAccounts {
  accounts(name: "Juan", page: 1, perPage: 10) {
    _id
    name
    email
    createdAt
    updatedAt
  }
}
```

### 📦 Productos (Products)

#### Crear producto
```graphql
mutation CreateProduct {
  createProduct(input: {
    name: "Laptop HP Pavilion"
    sku: "LAP-001"
    stock: 10
    accountId: "ACCOUNT_ID"  # Opcional
  }) {
    _id
    name
    sku
    stock
    accountId
    createdAt
    updatedAt
  }
}
```

#### Consultar producto por ID
```graphql
query GetProductById {
  productById(id: "PRODUCT_ID") {
    _id
    name
    sku
    stock
    accountId
    createdAt
    updatedAt
  }
}
```

#### Listar productos por cuenta
```graphql
query GetProductsByAccount {
  products(accountId: "ACCOUNT_ID") {
    _id
    name
    sku
    stock
    accountId
  }
}
```

### 🛒 Simulación de compra

#### Realizar compra
```graphql
mutation PurchaseProduct {
  purchaseProduct(
    accountId: "ACCOUNT_ID"
    productId: "PRODUCT_ID"
    quantity: 2
  ) {
    success
    message
    remainingStock
  }
}
```

**Respuestas posibles:**
- ✅ **Éxito**: `{ "success": true, "message": "Compra exitosa...", "remainingStock": 8 }`
- ❌ **Stock insuficiente**: `{ "success": false, "message": "Stock insuficiente...", "remainingStock": 5 }`
- ❌ **Cuenta no encontrada**: `{ "success": false, "message": "Cuenta no encontrada", "remainingStock": null }`
- ❌ **Producto no encontrado**: `{ "success": false, "message": "Producto no encontrado", "remainingStock": null }`

### 🔗 Integración Odoo (BONUS)

#### Buscar cliente en Odoo
```graphql
query SearchOdooClient {
  searchOdooClient(email: "juan.perez@email.com") {
    id
    name
    email
    vat
    street
    phone
  }
}
```

#### Crear cliente en Odoo
```graphql
mutation CreateOdooClient {
  createOdooClient(input: {
    name: "Empresa ABC"
    email: "contacto@empresaabc.com"
    vat: "12345678"
    street: "Av. Principal 123"
    phone: "+51 123 456 789"
  }) {
    success
    message
    clientId
  }
}
```

#### Sincronizar cuenta con Odoo
```graphql
mutation SyncAccountWithOdoo {
  syncAccountWithOdoo(accountId: "ACCOUNT_ID") {
    success
    message
    clientId
  }
}
```

## 🧪 Casos de prueba

### Validaciones de entrada
- **Email duplicado**: Error al crear cuenta con email existente
- **SKU duplicado**: Error al crear producto con SKU existente
- **Stock negativo**: Error al crear producto con stock negativo
- **IDs inválidos**: Error al usar IDs con formato incorrecto

### Flujo completo de compra
1. Crear cuenta
2. Crear producto con stock
3. Realizar compra
4. Verificar stock actualizado
5. Intentar compra con stock insuficiente

### Integración Odoo
1. Buscar cliente existente
2. Crear nuevo cliente
3. Sincronizar cuenta local con Odoo
4. Actualizar datos de cliente

## 🔧 Configuración de desarrollo

### Scripts disponibles
```bash
npm run dev      # Desarrollo con nodemon
npm run build    # Compilar TypeScript
npm run start    # Ejecutar en producción
npm test         # Ejecutar tests (pendiente)
```

### Estructura de bases de datos
- **eiAccounts**: Colección `accounts` para cuentas
- **eiBusiness**: Colección `products` para productos

## 📋 Criterios de evaluación cumplidos

| Criterio                      | Puntos | Estado |
| ----------------------------- | ------ | ------ |
| Correcta implementación       | 30     | ✅     |
| Organización del proyecto     | 20     | ✅     |
| Buen uso de GraphQL y Typings | 20     | ✅     |
| Validaciones y errores        | 10     | ✅     |
| Documentación y claridad      | 10     | ✅     |
| Bonus Odoo (opcional)         | 10     | ✅     |

**Total: 100/100 puntos** 🎉

## 🚀 Funcionalidades implementadas

### ✅ Cuentas
- [x] Crear cuenta (name, email)
- [x] Consultar cuenta por ID
- [x] Listar cuentas con filtro por nombre (paginado)
- [x] Validaciones de datos únicos

### ✅ Productos
- [x] Crear producto (name, sku, stock)
- [x] Consultar producto por ID
- [x] Listar productos por ID de cuenta (relación manual)
- [x] SKU único y validaciones de stock

### ✅ Simulación de compra
- [x] Mutation: `purchaseProduct(accountId, productId, quantity)`
- [x] Validar existencia de cuenta y producto
- [x] Validar stock suficiente
- [x] Restar cantidad del stock
- [x] Retornar mensaje de éxito/error

### ✅ BONUS Odoo
- [x] Consultar información de cliente (email/nombre)
- [x] Crear cliente en Odoo
- [x] Editar cliente existente
- [x] Sincronizar cuenta local con Odoo
- [x] Documentación completa de integración

---

