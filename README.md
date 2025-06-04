# Oreliya eCommerce MVP

This repository contains a minimal MERN stack implementation for **Oreliya**, a jewelry eCommerce demo. It provides a basic backend with authentication, product APIs and Stripe integration. The React frontend now includes Home, Products, Cart, Deals and About pages.

## Project Structure

```
oreliya/
├── client/             # React + Vite frontend
└── server/             # Node.js/Express backend
```

The backend uses MongoDB with Mongoose and issues JWT tokens for authentication. The frontend communicates with the backend via Axios and stores the auth token in local storage.

## Development

Install dependencies in both the `client` and `server` directories and run them individually:

```bash
cd server && npm install && npm run dev
cd ../client && npm install && npm run start
```

Create a `.env` file in `server/` with the following values:

```
DB_URI=your_mongodb_uri
JWT_SECRET=supersecret
STRIPE_SECRET_KEY=sk_test_yourkey
```

This MVP is intended as a starting point; additional pages and styling can be added on top of this foundation.

### Dummy Order API

For testing purposes, `/api/orders/dummy` returns static order data containing modern jewelry items.
