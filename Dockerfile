FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Comando para iniciar la aplicación (asegúrate de que sea el correcto)
CMD ["npm", "run", "start"]