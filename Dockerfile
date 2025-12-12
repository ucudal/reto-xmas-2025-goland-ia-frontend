# Stage 1: Build - Construir archivos estáticos
FROM node:20-alpine AS builder

# Instalar solo dependencias necesarias para el build
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (mejor caché de Docker)
COPY package.json package-lock.json* ./

# Instalar todas las dependencias (necesitamos devDependencies para el build)
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copiar el resto del código fuente
COPY . .

# Recibir argumentos de build (variables de entorno para Vite)
ARG VITE_API_URL=http://goland-backend:8080

# Establecer variables de entorno para el build
ENV VITE_API_URL=${VITE_API_URL} \
    NODE_ENV=production

# Construir la aplicación para producción
RUN npm run build && \
    rm -rf node_modules

# Stage 2: Production - Servir con Nginx (alpine es la versión más pequeña)
FROM nginx:1.27-alpine

# Remover archivos innecesarios de nginx para reducir tamaño
RUN rm -rf /usr/share/nginx/html/* && \
    rm -rf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos construidos desde el stage de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80

# Healthcheck para Kubernetes
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Nginx ya inicia automáticamente, no necesita CMD explícito
# Pero lo incluimos por claridad
CMD ["nginx", "-g", "daemon off;"]


