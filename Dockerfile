# Etapa de compilación
FROM node:18-alpine as build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Importante: Copiar una config de nginx para SPA (Single Page Application)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]