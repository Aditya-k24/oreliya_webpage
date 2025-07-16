# Oreliya - Full Stack E-commerce Monorepo

A modern, scalable full-stack e-commerce application built with TypeScript, React, Node.js, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+**
- **pnpm** (recommended) or npm
- **PostgreSQL 16+**
- **Git**

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd oreliya_webpage
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cd apps/api
   cp env.example .env
   ```

   Update `.env` with your database and Stripe credentials:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/oreliya"
   JWT_SECRET="your-jwt-secret"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. **Set up the database**

   ```bash
   cd apps/api
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```

5. **Start the development servers**

   ```bash
   # Start API server (from apps/api directory)
   pnpm dev

   # Start web app (from apps/web directory, in new terminal)
   cd apps/web
   pnpm dev
   ```

6. **Run tests**

   ```bash
   # Test all API endpoints
   cd apps/api
   ./test-api.sh

   # Test admin functionality
   pnpm tsx src/scripts/test-admin-api.ts
   ```

## 🏗️ Architecture

This project uses a **pnpm monorepo** structure with the following workspaces:

- **`apps/web`** - React frontend application (Vite + TypeScript)
- **`apps/api`** - Node.js backend API (Express + TypeScript)
- **`packages/ui`** - Shared UI components library

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing

### Backend

- **Node.js 20** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL 16** - Database
- **Prisma** - Database ORM
- **Winston** - Logging
- **Helmet, Morgan, CORS** - Security & logging middleware
- **Stripe** - Payment processing
- **JWT** - Authentication

## 🛍️ E-commerce Features

### Core Features

- **Product Management** - Full CRUD with variants and customizations
- **Shopping Cart** - Add, update, remove items
- **Wishlist** - Save favorite products
- **Order Management** - Create and track orders
- **Address Management** - Multiple shipping/billing addresses
- **User Authentication** - JWT-based auth with refresh tokens
- **Stripe Integration** - Secure payment processing
- **Admin Dashboard** - Complete admin panel

### Admin Dashboard

The application includes a comprehensive **Admin Dashboard** with full management capabilities.

#### Admin Features

- **📊 Analytics Dashboard**
  - Daily sales statistics (last 7 days)
  - Top products by quantity sold
  - Low inventory alerts (stock < 5)
  - Real-time data aggregation

- **🎯 Deals Management**
  - Create percentage/fixed discounts
  - Set usage limits and date ranges
  - Track deal usage and performance
  - Full CRUD operations

- **⚙️ Customization Management**
  - Product customization presets
  - Engraving, color, and option configurations
  - Price adjustment controls
  - Template management

- **👥 Role Management**
  - Create and manage user roles
  - Role-based access control
  - Permission management
  - User role assignments

#### Admin API Endpoints

```http
# Analytics & Stats
GET    /api/admin/stats                    # Dashboard statistics

# Deals Management
GET    /api/admin/deals                    # List all deals
POST   /api/admin/deals                    # Create new deal
PUT    /api/admin/deals/:id                # Update deal
DELETE /api/admin/deals/:id                # Delete deal

# Customization Management
GET    /api/admin/customizations           # List customizations
POST   /api/admin/customizations           # Create customization
PUT    /api/admin/customizations/:id       # Update customization
DELETE /api/admin/customizations/:id       # Delete customization

# Role Management
GET    /api/admin/roles                    # List all roles
POST   /api/admin/roles                    # Create new role
PUT    /api/admin/roles/:id                # Update role
DELETE /api/admin/roles/:id                # Delete role
```

#### Admin Authentication

- **Default Admin Credentials:**
  - Email: `admin@oreliya.com`
  - Password: `password123`

- **Admin Access:**
  - All admin endpoints require authentication
  - JWT token with admin role required
  - Role-based middleware protection

#### Example Admin Usage

```bash
# Login as admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@oreliya.com", "password": "password123"}'

# Get admin stats
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Create a deal
curl -X POST http://localhost:3001/api/admin/deals \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Sale",
    "description": "20% off all jewelry",
    "type": "percentage",
    "value": 20,
    "minAmount": 100,
    "maxDiscount": 500,
    "startDate": "2024-06-01T00:00:00Z",
    "endDate": "2024-08-31T23:59:59Z",
    "isActive": true,
    "usageLimit": 1000
  }'
```

## 🧪 Testing

### Automated Testing

The project includes comprehensive automated testing:

```bash
# Test all API endpoints
cd apps/api
./test-api.sh

# Test admin functionality
pnpm tsx src/scripts/test-admin-api.ts

# Run individual test suites
pnpm test:api          # Main API tests
pnpm test              # Jest unit tests
pnpm test:coverage     # Test coverage
```

### Test Coverage

- **✅ Health Check** - API status verification
- **✅ Authentication** - User signup, login, token refresh
- **✅ Product Management** - CRUD operations, filtering, search
- **✅ Cart Management** - Add, update, remove items
- **✅ Wishlist Management** - Add, remove, check items
- **✅ Address Management** - Full CRUD operations
- **✅ Order Management** - Order creation and tracking
- **✅ Webhook Integration** - Stripe webhook handling
- **✅ Admin Dashboard** - All admin endpoints and features

### Test Results

```
📊 Test Results Summary:
========================
Total Tests: 17
Passed: 17
Failed: 0
Success Rate: 100.0%

🎉 All tests passed! API is working correctly.
```

## 🛍️ Product API

The application includes a comprehensive **Product Management System** with advanced e-commerce features.

### Product Features

- **Product Variants**: Size, material, price, stock quantity, SKU
- **Product Customizations**: Engraving, color options, price adjustments
- **Sale Management**: Sale percentage, compare-at prices
- **Featured Products**: Highlight special items
- **Active/Inactive Status**: Product visibility control
- **Advanced Search & Filtering**: Category, tags, price range, sale status
- **Smart Pagination**: Configurable page size with metadata
- **Data Aggregation**: Categories, tags, deals & featured products

### API Endpoints

#### Product Management

```http
GET    /api/products                    # List products with filters
GET    /api/products/:slug              # Get product by slug
GET    /api/products/id/:id             # Get product by ID
POST   /api/products                    # Create product (admin)
PUT    /api/products/:id                # Update product (admin)
DELETE /api/products/:id                # Delete product (admin)
```

#### Product Data

```http
GET    /api/products/categories         # Get all categories
GET    /api/products/tags               # Get all tags
GET    /api/products/deals/featured     # Get deals & featured products
```

### Query Parameters

#### Filtering Options

```http
GET /api/products?category=Jewelry&isOnSale=true&priceMin=100&priceMax=1000
```

| Parameter    | Type    | Description                       |
| ------------ | ------- | --------------------------------- |
| `category`   | string  | Filter by product category        |
| `tags`       | string  | Filter by tags (comma-separated)  |
| `priceMin`   | number  | Minimum price filter              |
| `priceMax`   | number  | Maximum price filter              |
| `isActive`   | boolean | Filter by active status           |
| `isFeatured` | boolean | Filter by featured status         |
| `isOnSale`   | boolean | Filter by sale status             |
| `inStock`    | boolean | Filter by stock availability      |
| `search`     | string  | Search in name, description, tags |

#### Pagination & Sorting

```http
GET /api/products?page=1&limit=20&sortBy=price&sortOrder=asc
```

| Parameter   | Type   | Default   | Description                                    |
| ----------- | ------ | --------- | ---------------------------------------------- |
| `page`      | number | 1         | Page number (1-based)                          |
| `limit`     | number | 20        | Items per page (1-100)                         |
| `sortBy`    | string | createdAt | Sort field (name, price, createdAt, updatedAt) |
| `sortOrder` | string | desc      | Sort order (asc, desc)                         |

### Example Responses

#### Product List Response

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "cmd1qfllk00084akvnq6s5urp",
        "name": "Diamond Ring",
        "slug": "diamond-ring",
        "description": "A beautiful diamond ring perfect for special occasions",
        "shortDescription": "Elegant diamond ring",
        "price": "999.99",
        "compareAtPrice": "1299.99",
        "images": [
          "https://example.com/ring1.jpg",
          "https://example.com/ring2.jpg"
        ],
        "category": "Jewelry",
        "tags": ["diamond", "ring", "jewelry", "premium"],
        "isActive": true,
        "isFeatured": true,
        "isOnSale": true,
        "salePercentage": 23,
        "variants": [
          {
            "id": "cmd1qfllk00094akvisxjobk4",
            "size": "6",
            "material": "White Gold",
            "price": "999.99",
            "stockQuantity": 5,
            "sku": "RING-001-6-WG",
            "isActive": true
          }
        ],
        "customizations": [
          {
            "id": "cmd1qfllk000b4akvj435b6gj",
            "name": "Engraving",
            "type": "text",
            "required": false,
            "options": [],
            "priceAdjustment": "50"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "filters": {
      "category": "Jewelry",
      "isOnSale": true
    },
    "sort": {
      "field": "createdAt",
      "order": "desc"
    }
  }
}
```

#### Categories Response

```json
{
  "success": true,
  "data": {
    "categories": ["Jewelry", "Watches"]
  }
}
```

#### Tags Response

```json
{
  "success": true,
  "data": {
    "tags": [
      "diamond",
      "ring",
      "jewelry",
      "premium",
      "watch",
      "luxury",
      "professional"
    ]
  }
}
```

#### Deals & Featured Response

```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "id": "cmd1qfllk00084akvnq6s5urp",
        "name": "Diamond Ring",
        "isOnSale": true,
        "salePercentage": 23
      }
    ],
    "featured": [
      {
        "id": "cmd1qfllk00084akvnq6s5urp",
        "name": "Diamond Ring",
        "isFeatured": true
      },
      {
        "id": "cmd1qflmo000c4akvf10huwjh",
        "name": "Luxury Watch",
        "isFeatured": true
      }
    ]
  }
}
```

### Database Schema

#### Product Model

```prisma
model Product {
  id                String   @id @default(cuid())
  name              String
  slug              String   @unique
  description       String
  shortDescription  String?
  price             Decimal  @db.Decimal(10, 2)
  compareAtPrice    Decimal? @db.Decimal(10, 2)
  images            String[] // Array of image URLs
  category          String   // Simple string category
  tags              String[] // Array of tags
  isActive          Boolean  @default(true)
  isFeatured        Boolean  @default(false)
  isOnSale          Boolean  @default(false)
  salePercentage    Int?     // Percentage discount
  metadata          Json?    // Additional metadata
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  variants       ProductVariant[]
  customizations ProductCustomization[]
  reviews        Review[]
  cartItems      CartItem[]
  orderItems     OrderItem[]
  wishlists      Wishlist[]
}
```

#### Product Variant Model

```prisma
model ProductVariant {
  id            String   @id @default(cuid())
  productId     String
  size          String?
  material      String?
  price         Decimal  @db.Decimal(10, 2)
  stockQuantity Int      @default(0)
  sku           String   @unique
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

#### Product Customization Model

```prisma
model ProductCustomization {
  id               String   @id @default(cuid())
  productId        String
  name             String   // e.g., "Engraving Text"
  type             String   // e.g., "text", "image", "color", "select"
  required         Boolean  @default(false)
  options          String[] // For select type: ["option1", "option2"]
  priceAdjustment  Decimal? @db.Decimal(10, 2)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

### Usage Examples

#### Get Products with Filters

```bash
# Get all jewelry products on sale
curl "http://localhost:3001/api/products?category=Jewelry&isOnSale=true"

# Get products in price range
curl "http://localhost:3001/api/products?priceMin=500&priceMax=1500"

# Search for diamond products
curl "http://localhost:3001/api/products?search=diamond"

# Get featured products with pagination
curl "http://localhost:3001/api/products?isFeatured=true&page=1&limit=10"
```

#### Get Product by Slug

```bash
curl "http://localhost:3001/api/products/diamond-ring"
```

#### Get Categories and Tags

```bash
# Get all categories
curl "http://localhost:3001/api/products/categories"

# Get all tags
curl "http://localhost:3001/api/products/tags"
```

#### Get Deals and Featured Products

```bash
curl "http://localhost:3001/api/products/deals/featured"
```

### Validation & Error Handling

The API includes comprehensive validation:

- **Required fields**: name, description, price, category
- **Price validation**: Must be greater than 0
- **Stock validation**: Cannot be negative
- **Pagination limits**: Page size 1-100
- **Proper error responses** with HTTP status codes

#### Example Error Response

```json
{
  "success": false,
  "message": "Price must be greater than 0",
  "code": "VALIDATION_ERROR"
}
```

#### API Structure & Best Practices

The API follows a modular, scalable structure:

```
apps/api/src/
├── config/         # Configuration (logger, database, etc.)
├── controllers/    # Route controllers (business logic)
├── middlewares/    # Express middlewares (error, async, etc.)
├── repositories/   # Data access layer
├── routes/         # Route definitions
├── services/       # Service layer (domain logic)
├── utils/          # Utility functions (error classes, helpers)
├── types/          # TypeScript types/interfaces
├── server.ts       # Main Express app entry point
```

- **Winston logger** for structured logging
- **Global error handler** and custom error classes
- **Async wrapper** for safe async route handling
- **Health check endpoint** at `/api/health`
- **TypeScript** throughout for safety and maintainability

#### Example: Health Check Endpoint

- **Route:** `GET /api/health`
- **Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-07-12T21:38:07.819Z",
    "uptime": 2.13,
    "services": {
      "database": { "status": "connected", "responseTime": 75 },
      "memory": { "used": 13, "total": 31, "percentage": 43.81 }
    }
  }
}
```

#### Extending the API

- Add new business logic in `controllers/`, `services/`, and `repositories/`
- Register new routes in `routes/`
- Use the async wrapper and error handler for robust error management
- All new code should use TypeScript types from `types/`

#### Error Handling, Async Wrapper, and Logger

- **Global error handler**: All errors are caught and formatted as JSON responses. Custom errors extend `CustomError` in `utils/errors.ts`.
- **Async wrapper**: Use `asyncWrapper` from `middlewares/asyncWrapper.ts` to wrap all async route handlers for automatic error forwarding.
- **Winston logger**: Use `logger` from `config/logger.ts` for structured logging (info, warn, error, debug).

**Example error response:**

```json
{
  "success": false,
  "message": "Route /api/unknown not found",
  "code": "NOT_FOUND"
}
```

**Adding new middleware or error types:**

- Place new middleware in `middlewares/` and use in `server.ts` or specific routes.
- Add new error classes in `utils/errors.ts` as needed, extending `CustomError`.

#### Troubleshooting: Port Conflicts

- If you see errors like `EADDRINUSE`, another process is using the port. Stop the process or let the server auto-select a new port.
- You can kill all Node/Vite dev servers with:
  ```bash
  pkill -f tsx
  pkill -f vite
  ```
- Then restart with `pnpm --filter api dev` and `pnpm --filter web dev`.

---

### Development Tools

- **pnpm** - Package manager
- **ESLint** - Code linting (Airbnb + TypeScript)
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **commitlint** - Commit message validation

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📚 Next Steps

1. **Authentication**: Implement JWT auth with refresh tokens
2. **Testing**: Add Jest/Vitest test suites
3. **CI/CD**: Set up GitHub Actions
4. **Monitoring**: Add logging and metrics
5. **Documentation**: API documentation with Swagger
6. **Frontend Integration**: Connect React app to API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔐 Authentication System

The backend API implements a robust authentication and authorization system with the following features:

- **User Signup** (`POST /api/auth/signup`): Register a new user, validate input, hash password, assign default role, return JWT tokens.
- **User Login** (`POST /api/auth/login`): Authenticate user, check password, return JWT tokens.
- **User Logout** (`POST /api/auth/logout`): Invalidate refresh token.
- **Token Refresh** (`POST /api/auth/refresh`): Exchange a valid refresh token for new access/refresh tokens.
- **Get Current User** (`GET /api/auth/me`): Return authenticated user's profile (requires access token).
- **Role-Based Access Control (RBAC)**: Middleware to restrict routes to users with specific roles (e.g., `requireUser`, `requireAdmin`).
- **Password Hashing**: All passwords are securely hashed with bcrypt.
- **JWT Authentication**: Access and refresh tokens are signed and verified using environment secrets.
- **Prisma Repository Pattern**: All DB access is abstracted in repositories for testability and maintainability.
- **Comprehensive Error Handling**: Custom error classes and global error handler for consistent API responses.

### Example Auth Endpoints

#### Signup

```http
POST /api/auth/signup
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Logout

```http
POST /api/auth/logout
Content-Type: application/json
{
  "refreshToken": "<refresh_token>"
}
```

#### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json
{
  "refreshToken": "<refresh_token>"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Testing

- All authentication endpoints and logic are covered by Jest and Supertest tests.
- Run all tests with:
  ```bash
  pnpm --filter api test
  ```
- All tests must pass before commit (see CI pipeline).

---

## 🧪 Automated API Testing

This project includes a comprehensive automated API test script that verifies all major API endpoints and flows, including both public and authenticated routes.

### What is Tested?

- Health check endpoint
- User signup and login (authentication)
- Product listing, deals, featured products, categories, and tags
- Address management (create, get, update, delete)
- Cart, wishlist, and order endpoints (basic checks)
- Webhook endpoint (Stripe signature validation)

### How to Run All API Tests

1. **Ensure the API server is not already running on port 3001.**
2. From the project root, run:

   ```sh
   ./apps/api/test-api.sh
   ```

   Or, from the `apps/api` directory:

   ```sh
   ./test-api.sh
   ```

   This script will:
   - Start the API server if not already running
   - Run all API endpoint tests in sequence
   - Print a summary of passed/failed tests

3. **To run the test script directly (API must already be running):**
   ```sh
   pnpm test:api
   ```

### Test Results

- All endpoints must pass for a healthy, production-ready API.
- If any test fails, the script will print the error and a summary at the end.

---
