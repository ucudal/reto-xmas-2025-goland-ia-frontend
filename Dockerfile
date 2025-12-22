# Stage 1: Build - Construir archivos estáticos
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Recibir argumentos de build (variables de entorno para Vite)
ARG VITE_API_URL=http://goland-backend:8080

# Establecer variables de entorno para el build
ENV VITE_API_URL=${VITE_API_URL}

# Construir la aplicación para producción
RUN npm run build

# Stage 2: Production - Servir con Nginx
FROM nginx:alpine

# Copiar los archivos estáticos construidos desde el stage de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80

# Nginx ya inicia automáticamente, no necesita CMD explícito
# Pero lo incluimos por claridad
CMD ["nginx", "-g", "daemon off;"]


