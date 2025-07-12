# Oreliya - Full Stack Monorepo

A modern, scalable full-stack application built with TypeScript, React, Node.js, and PostgreSQL.

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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose (for full stack)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd oreliya
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp apps/api/env.example apps/api/.env
   # Edit the .env file with your configuration
   ```

4. **Set up the database**

   ```bash
   # Start PostgreSQL with Docker
   pnpm docker:up

   # Run database migrations
   pnpm --filter api db:migrate

   # Seed the database with demo data
   pnpm --filter api db:seed
   ```

### Development

#### Start all services

```bash
# Start frontend and backend in parallel
pnpm dev

# Frontend will be available at http://localhost:5173
# Backend will be available at http://localhost:3000
# Database will be available at localhost:5432
```

#### Start individual services

```bash
# Frontend only
pnpm --filter web dev

# Backend only
pnpm --filter api dev
```

#### Docker (Full Stack)

```bash
# Build and start all services
pnpm docker:build
pnpm docker:up

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down
```

## 📜 Available Scripts

### Root Level

```bash
pnpm dev          # Start all services in development mode
pnpm build        # Build all packages
pnpm test         # Run tests across all packages
pnpm lint         # Lint all packages
pnpm lint:fix     # Fix linting issues
pnpm type-check   # Run TypeScript type checking
pnpm clean        # Clean all build artifacts
```

### Docker Commands

```bash
pnpm docker:build # Build Docker images
pnpm docker:up    # Start Docker services
pnpm docker:down  # Stop Docker services
pnpm docker:logs  # View Docker logs
```

### Individual Workspace Commands

```bash
# Web app
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web preview

# API
pnpm --filter api dev
pnpm --filter api build
pnpm --filter api start

# Database
pnpm --filter api db:generate    # Generate Prisma client
pnpm --filter api db:migrate     # Run migrations
pnpm --filter api db:seed        # Seed database
pnpm --filter api db:studio      # Open Prisma Studio
pnpm --filter api db:reset       # Reset database

# UI Package
pnpm --filter ui build
pnpm --filter ui dev
```

## 🏗️ Project Structure

```
oreliya_webpage/
├── .husky/                          # Git hooks
│   ├── pre-commit                   # Pre-commit linting
│   └── commit-msg                   # Commit message validation
├── apps/
│   ├── api/                         # Node.js backend
│   │   ├── src/
│   │   │   ├── config/             # Configuration (logger, database, etc.)
│   │   │   ├── controllers/        # Route controllers (business logic)
│   │   │   ├── middlewares/        # Express middlewares (error, async, etc.)
│   │   │   ├── repositories/       # Data access layer
│   │   │   ├── routes/             # Route definitions
│   │   │   ├── services/           # Service layer (domain logic)
│   │   │   ├── utils/              # Utility functions (error classes, helpers)
│   │   │   ├── types/              # TypeScript types/interfaces
│   │   │   ├── server.ts           # Main Express app entry point
│   │   │   └── lib/
│   │   │       └── prisma.ts       # Prisma client instance
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   └── seed.ts             # Database seed script
│   │   ├── package.json            # API dependencies
│   │   ├── tsconfig.json           # TypeScript config
│   │   └── env.example             # Environment variables template
│   └── web/                         # React frontend
│       ├── src/
│       │   ├── App.tsx             # Main React component
│       │   ├── main.tsx            # React entry point
│       │   └── index.css           # Global styles
│       ├── public/
│       ├── package.json            # Web dependencies
│       ├── tsconfig.json           # TypeScript config
│       ├── tsconfig.node.json      # Node tools config
│       ├── vite.config.ts          # Vite configuration
│       └── index.html              # HTML template
├── packages/
│   └── ui/                          # Shared UI components
│       ├── src/
│       │   ├── components/
│       │   │   └── Button.tsx      # Button component
│       │   ├── styles/
│       │   │   └── button.css      # Button styles
│       │   └── index.ts            # Package exports
│       ├── package.json            # UI package config
│       └── tsconfig.json           # TypeScript config
├── .editorconfig                   # Editor configuration
├── .eslintrc.js                    # ESLint (Airbnb + TypeScript)
├── .gitignore                      # Git ignore rules
├── .lintstagedrc.js                # Pre-commit linting config
├── .prettierrc                     # Code formatting rules
├── commitlint.config.js            # Commit message rules
├── docker-compose.yml              # Docker services (PostgreSQL + API)
├── Dockerfile                      # API Docker image (Node 20-slim)
├── package.json                    # Root monorepo config
├── pnpm-workspace.yaml             # pnpm workspace definition
├── README.md                       # Comprehensive documentation
└── tsconfig.json                   # Root TypeScript configuration
```

## 🔧 Configuration

### Code Quality

- **ESLint**: Airbnb + TypeScript rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for linting and formatting
- **commitlint**: Conventional commit messages

### Docker

- **API**: Node.js 20-slim with pnpm
- **Database**: PostgreSQL 16-alpine with health checks
- **Networking**: Isolated Docker network

### Database

- **ORM**: Prisma with PostgreSQL
- **Migrations**: Version-controlled schema changes
- **Seeding**: Automated demo data population
- **Studio**: Visual database management tool

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow Airbnb ESLint rules
- Use Prettier for formatting
- Write conventional commit messages

### Git Workflow

1. Create feature branch from `main`
2. Make changes with proper commits
3. Run `pnpm lint` and `pnpm type-check`
4. Create pull request
5. Ensure CI passes

### Adding New Dependencies

```bash
# Add to specific workspace
pnpm --filter <workspace-name> add <package-name>

# Add dev dependency
pnpm --filter <workspace-name> add -D <package-name>

# Add to root (shared dev dependencies)
pnpm add -D <package-name>
```

### Database Operations

```bash
# Generate Prisma client after schema changes
pnpm --filter api db:generate

# Create and apply new migration
pnpm --filter api db:migrate

# Reset database and re-seed
pnpm --filter api db:reset

# Open Prisma Studio for database management
pnpm --filter api db:studio
```

## 🐳 Docker Services

### API Service

- **Port**: 3000
- **Health Check**: `GET /health`
- **Environment**: Production-ready with security headers

### PostgreSQL Database

- **Port**: 5432
- **Database**: `oreliya_db`
- **Health Check**: Automatic with `pg_isready`
- **Persistence**: Docker volume
- **Schema**: 16 models with relationships

## 🔍 API Endpoints

### Health & Status

- `GET /health` - Health check with database connection status
- `GET /api/db-test` - Database connection test with record counts

### Sample Endpoints

- `GET /api/hello` - Sample endpoint

### Database Management

- `POST /api/db/migrate` - Run database migrations (planned)
- `POST /api/db/seed` - Seed database with demo data (planned)

## 🗄️ Database Schema

The application uses **Prisma ORM** with PostgreSQL and includes a comprehensive e-commerce schema:

### Core Models (16 total)

- **Users & Authentication**: `User`, `Role`, `RefreshToken`
- **Addresses**: `Address` (billing/shipping)
- **Products**: `Product`, `ProductImage`, `ProductVariant`, `Customization`
- **Categories**: `Category` (hierarchical structure)
- **E-commerce**: `Cart`, `CartItem`, `Order`, `OrderItem`
- **User Features**: `Wishlist`, `Review`
- **Promotions**: `Deal`

### Key Features

- **Relationships**: Proper foreign keys with cascade deletes
- **Data Types**: Decimal for prices, JSON for complex data
- **Constraints**: Unique constraints, required fields
- **Audit Fields**: Created/updated timestamps
- **Customizations**: Support for product personalization (engraving, etc.)

### Demo Data

The seed script creates comprehensive demo data including:

- Admin and customer users
- Sample products (jewelry, watches)
- Complete e-commerce flow (cart, orders, reviews)
- Product customizations and variants

**Demo Credentials:**

- **Admin**: `admin@oreliya.com` / `password123`
- **Customer**: `customer@oreliya.com` / `password123`

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
