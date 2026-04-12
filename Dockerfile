# -- Stage 1 - Builder
FROM node:22-alpine AS builder
WORKDIR /application

# Copiamos solo los archivos de dependencias primero
COPY package*.json ./

# Instalamos dependencias limpias (npm ci es preferible en CI/CD)
RUN npm ci

# Copiamos el resto del código (aquí entra en juego el .dockerignore)
COPY . .

# Construimos la aplicación
RUN npm run build:production


# -- Stage 2 - Runner
FROM nginx:stable-alpine

ARG API_URL

# Copiar la configuración personalizada de Nginx a la imagen
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos
COPY --from=builder /application/dist/bibliokeep-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
