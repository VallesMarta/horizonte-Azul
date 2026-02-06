FROM node:20-alpine

WORKDIR /app

# Copiamos desde la raíz del proyecto hacia el WORKDIR del contenedor
COPY frontend/package*.json ./

RUN npm install

# Copiamos todo el contenido de la carpeta frontend
COPY frontend/ .

EXPOSE 3000

# Asegúrate de que en package.json el script "dev" esté configurado
CMD ["npm", "run", "dev"]