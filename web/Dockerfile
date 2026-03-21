# Multi-stage build for React + Vite application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_AUTH0_REDIRECT_URI
ARG VITE_PINS_API_URL
ARG VITE_MAP_PROVIDER
ARG VITE_GOOGLE_MAPS_KEY
ARG VITE_REVERSE_GEOCODE_URL
ARG VITE_LEAFLET_TILE_URL
ARG VITE_LEAFLET_ATTRIBUTION
ARG VITE_DEFAULT_CENTER_LAT
ARG VITE_DEFAULT_CENTER_LNG
ARG FRONTEND_PORT=3000

# Set environment variables for build
ENV VITE_AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN}
ENV VITE_AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID}
ENV VITE_AUTH0_AUDIENCE=${VITE_AUTH0_AUDIENCE}
ENV VITE_AUTH0_REDIRECT_URI=${VITE_AUTH0_REDIRECT_URI}
ENV VITE_PINS_API_URL=${VITE_PINS_API_URL}
ENV VITE_MAP_PROVIDER=${VITE_MAP_PROVIDER}
ENV VITE_GOOGLE_MAPS_KEY=${VITE_GOOGLE_MAPS_KEY}
ENV VITE_REVERSE_GEOCODE_URL=${VITE_REVERSE_GEOCODE_URL}
ENV VITE_LEAFLET_TILE_URL=${VITE_LEAFLET_TILE_URL}
ENV VITE_LEAFLET_ATTRIBUTION=${VITE_LEAFLET_ATTRIBUTION}
ENV VITE_DEFAULT_CENTER_LAT=${VITE_DEFAULT_CENTER_LAT}
ENV VITE_DEFAULT_CENTER_LNG=${VITE_DEFAULT_CENTER_LNG}

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

ARG FRONTEND_PORT=3000
ENV FRONTEND_PORT=${FRONTEND_PORT}

# Copy nginx configuration
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built application from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD /bin/sh -c "wget --no-verbose --tries=1 --spider http://127.0.0.1:${FRONTEND_PORT}/ || exit 1"

# Expose frontend port
EXPOSE ${FRONTEND_PORT}

# Start nginx
CMD ["/bin/sh", "-c", "envsubst '$FRONTEND_PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
