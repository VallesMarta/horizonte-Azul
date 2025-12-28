# Horizonte Azul

Proyecto web de gestión de viajes y reservas, desarrollado con **React** (frontend), **Node.js + Express + MongoDB** (backend) y **TailwindCSS** para estilos. Desplegado en **AWS EC2** con **NGINX** como servidor web y **PM2** para gestión de procesos del backend.

---

## Requisitos

- Node.js ≥ 18
- npm
- MongoDB
- PM2 (`npm install pm2 -g`)
- NGINX
- Acceso a AWS EC2

---

## Instalación

### 1. Clonar el repositorio

```git
git clone https://github.com/VallesMarta/horizonteAzul.git
cd horizonteAzul
```

### 2. Instalar dependencias

`npm install`

### 3. Configurar variables de entorno
Crear un archivo ***.env*** en la raíz:
```env
VITE_URL_API=http://13.50.102.252:3000
```
---

## Backend (API)
1. Levantar la API con PM2 (***LA PRIMERA VEZ***):
    * `pm2 start src/index.js --name api`    
    PM2 es un gestor de procesos para Node.js que mantiene la API en ejecución continua, reinicia automáticamente si falla y permite monitoreo de logs.
    
2. Reiniciar la API tras cambios:
    * `pm2 restart api`
    * `pm2 logs api`  -->   Ver logs en tiempo real:

## Frontend (React)
Cada vez que se modifique algo en el frontend (React, Tailwind, imágenes, etc.):
1. Generar la nueva build:
    * `npm run build`
2. Limpiar la versión antigua en NGINX:
    * `sudo rm -rf /var/www/horizonteAzul/*`
3. Copiar los archivos nuevos al servidor web:
    * `sudo cp -r dist/* /var/www/horizonteAzul/`
4. Probar la configuración de NGINX:
    * `sudo nginx -t`
5. Recargar NGINX para servir la nueva versión:
    * `sudo systemctl reload nginx`
6. Si NGINX FALLA a continuación:
    * `sudo systemctl daemon-reload`

## Estructura del proyecto
```bash
horizonteAzul/
│
├─ src/                # Código fuente backend y frontend
│  ├─ components/      # Componentes de React
│  ├─ models/          # Modelos de MongoDB
│  ├─ routes/          # Rutas de la API
│  └─ index.js         # Entrada principal de la API
│
├─ public/             # Archivos estáticos (img)
├─ dist/               # Build generada por React
├─ package.json
└─ README.md
```

## Uso
* Todos los usuarios se identifican mediante **username_id** en **localStorage**.
* Las imágenes del frontend deben copiarse en **/public/media/** para que NGINX las sirva correctamente.
* Para trabajar con reservas de un usuario específico, la API expone:

```
GET /reservas/mis-reservas/:usuarioId
```

* Crear nuevas reservas:

```
POST /reservas
```
Con JSON:

```json
{
  "usuario": "id_usuario",
  "viaje": "id_viaje",
  "nombre": "Nombre completo",
  "pasajeros": 1,
  "fecSalida": "2025-12-01",
  "estado": "pendiente"
}
```

## Despliegue en AWS EC2
1. Clonar y actualizar repositorio en EC2:
    
    `git pull origin main`

2. Backend: reiniciar API si hay cambios en src/index.js (como se explicó en la sección Backend):

    `pm2 restart api`

3. Frontend: generar build y actualizar NGINX (como se explicó en la sección Frontend).

## Notas adicionales

* Para solucionar errores **500 de NGINX**, asegúrate de que:

* La carpeta **/var/www/horizonteAzul/** tenga los permisos correctos.

* Las imágenes estén copiadas correctamente en **dist/media/** antes de copiar al servidor.

* NGINX se recargue después de copiar los archivos.

* Monitoreo de PM2:
    ```
    pm2 list
    pm2 logs
    pm2 monit
    ```


Desarrollado por Marta Vallés
