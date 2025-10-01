# Use Node.js 20 slim image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@8.15.0

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy workspace packages
COPY apps/web-next/package.json ./apps/web-next/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm --filter web-next build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["pnpm", "--filter", "web-next", "start"] 