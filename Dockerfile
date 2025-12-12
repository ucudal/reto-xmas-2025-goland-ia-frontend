# Usar imagen oficial de Node LTS (Alpine para tamaño reducido)
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto por defecto de Vite (5173)
EXPOSE 5173

# Comando para iniciar el servidor de desarrollo
# --host 0.0.0.0 permite acceso desde fuera del contenedor
# --port 5173 especifica el puerto explícitamente
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]


