# ✈️ Proyecto Horizonte Azul - Gestión de Viajes

Sistema integral para la gestión de vuelos, rutas y servicios adicionales, diseñado para optimizar la logística de Horizonte Azul.

## Tecnologías Utilizadas

- **Frontend/API:** Next.js 15 (App Router)
- **Estilos:** Tailwind CSS
- **Base de Datos:** MySQL
- **Contenedorización:** Docker & Docker Compose

## Puesta en Marcha (Entorno de Desarrollo)

Para trabajar en local, se requiere tener instalado **Docker** y **Docker Compose**.

### 1. Clonar el repositorio

```bash
git clone [https://github.com/VallesMarta/horizonte-Azul.git](https://github.com/VallesMarta/horizonte-Azul.git)

cd horizonte-azul
```

### 2. Configuración de Entorno

Copia el archivo _**.env.example**_ y renómbralo a _**.env**_ . Rellena las variables necesarias:

```bash
cp .env.example .env
```

### 3. Levantar la infraestructura

Ejecuta el siguiente comando para levantar la aplicación Next.js, la base de datos MySQL y phpMyAdmin:

```bash
docker-compose up -d
```

### 4. Acceso

**Frontend**: http://localhost:3000

**phpMyAdmin (DB)**: http://localhost:8080 (Usa las credenciales del .env)

## Flujo de Trabajo y Despliegue (GitFlow)

**develop:** Rama de desarrollo activo. Aquí se integran las nuevas funcionalidades y se realizan pruebas ("prueba y error").

**main:** Rama de producción. Solo contiene código estable.

## Despliegue Automático (CI/CD)

El proyecto cuenta con integración continua configurada en GitHub Actions. Al realizar un git push a la rama main, se activa automáticamente el flujo que:

- Compila la imagen Docker.

- Sube la imagen al registro de Azure (**horizonteazulacr**).

- Actualiza el App Service (**horizonte-azul-web**) en producción.
