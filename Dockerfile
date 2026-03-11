# ============================================
# Stage 1: Build
# ============================================
FROM node:20.11.1-alpine AS build-stage

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies with production flag
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM nginx:1.25.4-alpine AS production-stage

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy built files from build stage
COPY --from=build-stage --chown=appuser:appgroup /app/dist /var/www/dist

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
