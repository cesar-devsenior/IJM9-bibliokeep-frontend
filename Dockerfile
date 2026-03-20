# -- Stage 1 - Builder
FROM node:22-alpine AS builder
WORKDIR /application

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:production

# -- Stage 2 - Runner
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /application/dist/bibliokeep-frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]



