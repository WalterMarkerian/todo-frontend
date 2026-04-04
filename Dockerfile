# Etapa 1: Build con Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor con Nginx
FROM nginx:stable-alpine
# Copiamos el build de la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]