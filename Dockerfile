# ============================================
# Stage 1: Build
# ============================================
FROM node:20.11.1-alpine AS build-stage

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

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
    adduser -u 1001 -S appuser -G appgroup && \
    mkdir -p /var/www \
             /tmp/nginx/client_temp \
             /tmp/nginx/proxy_temp \
             /tmp/nginx/fastcgi_temp \
             /tmp/nginx/uwsgi_temp \
             /tmp/nginx/scgi_temp \
             /var/www/dist && \
    chown -R appuser:appgroup /tmp/nginx /var/www

# Copy built files from build stage
COPY --from=build-stage --chown=appuser:appgroup /app/dist /var/www/dist

# Copy nginx config
COPY --chown=appuser:appgroup nginx.conf /etc/nginx/nginx.conf
COPY --chown=appuser:appgroup docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/ || exit 1

# Generate runtime config, then start nginx directly
ENTRYPOINT ["/bin/sh", "/usr/local/bin/docker-entrypoint.sh"]
