# Usar una imagen base de Node.js para construir la aplicación
FROM node:14-alpine AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código fuente a la carpeta de trabajo
COPY . .

# Construir la aplicación
RUN npm run build

# Usar una imagen base de nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa de build al directorio que Nginx usa para servir el contenido estático
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto que Nginx utilizará para servir la aplicación
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
