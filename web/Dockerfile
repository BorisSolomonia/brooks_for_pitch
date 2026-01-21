# Multi-stage build for React + Vite application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY web/package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source code
COPY web/ .

# Build arguments for environment variables
ARG VITE_AUTH_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_AUTH0_REDIRECT_URI
ARG VITE_SOCIAL_API_URL
ARG VITE_LISTS_API_URL
ARG VITE_PINS_API_URL
ARG VITE_MEDIA_API_URL
ARG VITE_MODERATION_API_URL
ARG VITE_NOTIFICATIONS_API_URL
ARG VITE_MAP_PROVIDER
ARG VITE_GOOGLE_MAPS_KEY
ARG VITE_NOMINATIM_URL

# Set environment variables for build
ENV VITE_AUTH_API_URL=${VITE_AUTH_API_URL}
ENV VITE_AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN}
ENV VITE_AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID}
ENV VITE_AUTH0_AUDIENCE=${VITE_AUTH0_AUDIENCE}
ENV VITE_AUTH0_REDIRECT_URI=${VITE_AUTH0_REDIRECT_URI}
ENV VITE_SOCIAL_API_URL=${VITE_SOCIAL_API_URL}
ENV VITE_LISTS_API_URL=${VITE_LISTS_API_URL}
ENV VITE_PINS_API_URL=${VITE_PINS_API_URL}
ENV VITE_MEDIA_API_URL=${VITE_MEDIA_API_URL}
ENV VITE_MODERATION_API_URL=${VITE_MODERATION_API_URL}
ENV VITE_NOTIFICATIONS_API_URL=${VITE_NOTIFICATIONS_API_URL}
ENV VITE_MAP_PROVIDER=${VITE_MAP_PROVIDER}
ENV VITE_GOOGLE_MAPS_KEY=${VITE_GOOGLE_MAPS_KEY}
ENV VITE_NOMINATIM_URL=${VITE_NOMINATIM_URL}

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy nginx configuration
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
