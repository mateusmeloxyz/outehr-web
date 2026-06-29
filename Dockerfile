# ============================================
# Stage 1: Development
# ============================================
FROM node:20-slim AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]

# ============================================
# Stage 2: Build (Production)
# ============================================
FROM node:20-slim AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ============================================
# Stage 3: Production (Nginx)
# ============================================
FROM nginx:alpine AS production

# Copy built files to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]