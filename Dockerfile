FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

EXPOSE 3000

# Comando para iniciar la aplicación (asegúrate de que sea el correcto)
CMD ["npm", "start"]