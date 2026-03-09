FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nest-cli.json tsconfig.json ./
COPY prisma ./prisma/

# Install ALL dependencies (needed for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Verify build output exists
RUN test -f dist/main.js || (echo "ERROR: dist/main.js not found after build!" && exit 1)

# ── Production image ──────────────────────────────────────────────────────────
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --omit=dev

# Re-generate Prisma client in production image
RUN npx prisma generate

# Copy built dist from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

