# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /src

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /src

# Copy only required artifacts from builder
COPY --from=builder /src/dist ./dist
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src/prisma ./prisma
COPY package*.json ./

# Expose app port
EXPOSE 4000

# Start the app
CMD ["node", "dist/main.js"]
