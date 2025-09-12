# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Copy package files and install deps
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Debug: Show directory structure
RUN ls -la && echo "=== Building the application ==="

# Build the application
RUN npm run build

# Debug: Check if build was successful
RUN ls -la dist/ && echo "=== Build complete ==="

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /backend

# Install runtime dependencies
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Debug: Show final directory structure
RUN ls -la && echo "=== Contents of dist/ ===" && ls -la dist/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /backend
USER appuser

EXPOSE 4000

# Use dumb-init as entrypoint for better signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]