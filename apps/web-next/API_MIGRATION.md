# API Migration to Next.js

The API has been fully integrated into the Next.js application. All endpoints are now available under `/api/`.

## API Endpoint Mapping

### Authentication (`/api/auth-api/*`)
- `POST /api/auth-api/signup` - User registration
- `POST /api/auth-api/login` - User login
- `POST /api/auth-api/logout` - User logout
- `POST /api/auth-api/refresh` - Refresh access token
- `GET /api/auth-api/me` - Get current user (requires auth)

### Products (`/api/products-api/*`)
- `GET /api/products-api` - List products with filters
- `POST /api/products-api` - Create product (admin only)
- `GET /api/products-api/deals-featured` - Get deals and featured products
- `GET /api/products-api/categories` - List categories
- `GET /api/products-api/tags` - List tags
- `GET /api/products-api/id/[id]` - Get product by ID
- `PUT /api/products-api/id/[id]` - Update product (admin only)
- `DELETE /api/products-api/id/[id]` - Delete product (admin only)
- `GET /api/products-api/slug/[slug]` - Get product by slug
- `DELETE /api/products-api/slug/[slug]` - Delete product by slug (admin only)

### Cart (`/api/cart-api/*`)
- `GET /api/cart-api` - Get user's cart (requires auth)
- `DELETE /api/cart-api` - Clear cart (requires auth)
- `POST /api/cart-api/items` - Add item to cart (requires auth)
- `PUT /api/cart-api/items/[itemId]` - Update cart item (requires auth)
- `DELETE /api/cart-api/items/[itemId]` - Remove item from cart (requires auth)

### Orders (`/api/orders-api/*`)
- `GET /api/orders-api` - Get user's orders (requires auth)
- `POST /api/orders-api` - Create order (requires auth)
- `GET /api/orders-api/[id]` - Get order by ID (requires auth)
- `PATCH /api/orders-api/[id]/status` - Update order status (admin only)

### Addresses (`/api/addresses-api/*`)
- `GET /api/addresses-api` - List user addresses (requires auth)
- `POST /api/addresses-api` - Create address (requires auth)
- `GET /api/addresses-api/[id]` - Get address by ID (requires auth)
- `PUT /api/addresses-api/[id]` - Update address (requires auth)
- `DELETE /api/addresses-api/[id]` - Delete address (requires auth)

### Wishlist (`/api/wishlist-api/*`)
- `GET /api/wishlist-api` - Get user's wishlist (requires auth)
- `POST /api/wishlist-api` - Add to wishlist (requires auth)
- `DELETE /api/wishlist-api` - Clear wishlist (requires auth)
- `DELETE /api/wishlist-api/[productId]` - Remove from wishlist (requires auth)

### Webhooks (`/api/webhooks-api/*`)
- `POST /api/webhooks-api/stripe` - Stripe webhook handler

### Admin (`/api/admin/*`)
- `GET /api/admin/stats` - Get admin statistics (admin only)
- `GET /api/admin/deals` - List deals (admin only)
- `POST /api/admin/deals` - Create deal (admin only)
- `PUT /api/admin/deals/[id]` - Update deal (admin only)
- `DELETE /api/admin/deals/[id]` - Delete deal (admin only)
- `GET /api/admin/customizations` - List customization presets (admin only)
- `POST /api/admin/customizations` - Create customization preset (admin only)
- `PUT /api/admin/customizations/[id]` - Update customization preset (admin only)
- `DELETE /api/admin/customizations/[id]` - Delete customization preset (admin only)
- `GET /api/admin/roles` - List roles (admin only)
- `POST /api/admin/roles` - Create role (admin only)
- `PUT /api/admin/roles/[id]` - Update role (admin only)
- `DELETE /api/admin/roles/[id]` - Delete role (admin only)

### Utility Endpoints
- `GET /api/health` - Health check endpoint
- `GET /api/hello` - Simple hello endpoint
- `GET /api/db-test` - Database connection test

## Environment Variables

Create a `.env.local` file in the `apps/web-next` directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/oreliya_db?schema=public"

# JWT Secrets
JWT_ACCESS_SECRET="your-access-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-key-here"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Application
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
PORT=3000
```

## Database Setup

Run Prisma migrations:

```bash
cd apps/web-next
pnpm db:migrate:deploy  # For production
# or
pnpm db:push  # For development
```

## Running the Application

```bash
cd apps/web-next
pnpm install
pnpm dev
```

The application will run on `http://localhost:3000` with both the frontend and API integrated.

## API Structure

The API infrastructure is located in `src/api-lib/`:
- `controllers/` - Request handlers
- `services/` - Business logic
- `repositories/` - Database access layer
- `middlewares/` - Authentication and authorization
- `config/` - Configuration (database, JWT, logger)
- `types/` - TypeScript type definitions
- `utils/` - Utility functions
- `adapters/` - Next.js adapter for Express-style handlers

## Deployment

When deploying, ensure:
1. Set all environment variables in your hosting platform
2. Run `pnpm build` which includes Prisma generation
3. Run database migrations with `pnpm db:migrate:deploy`
4. The application serves both frontend and API from a single deployment


