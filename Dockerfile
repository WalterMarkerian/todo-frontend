# Stage 1: Build de la app
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# DEFINIMOS QUE ESPERAMOS UNA VARIABLE DE ENTORNO
ARG VITE_API_URL
# LA EXPORTAMOS PARA QUE VITE LA VEA AL MOMENTO DE HACER EL BUILD
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Servidor Nginx para los archivos estáticos
FROM nginx:alpine
# Copiamos la configuración personalizada de nginx si la tenés, 
# sino, la default de la imagen funciona bien para SPAs simples.
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]