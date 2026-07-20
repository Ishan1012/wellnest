# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Install only production dependencies
RUN npm ci --omit=dev
# Copy only the compiled dist folder from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]
