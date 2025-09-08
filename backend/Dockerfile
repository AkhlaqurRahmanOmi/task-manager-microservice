# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /src

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Nest.js
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Expose port
EXPOSE 4000

# Run the app
CMD ["node", "dist/main.js"]
