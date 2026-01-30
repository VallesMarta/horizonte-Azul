# Horizonte Azul API
Bienvenido a la API de Horizonte Azul, una plataforma de gestión de viajes, reservas y servicios turísticos. Este backend está construido con Next.js, MySQL y Docker, utilizando JWT y bcrypt para la seguridad.

## 1. Inicio Rápido
### 1.1 Requisitos previos
- Docker y Docker Compose
- Node.js (v18 o superior)

### 1.2 Configuración de las variables de entorno
Copia el archivo de ejemplo y rellena tus credenciales:

```
cp .env.example .env
```
## 2. Levantar la Base de Datos
Utilizamos Docker para asegurar que el entorno sea idéntico en cualquier máquina:

```bash
docker-compose up -d
```
>**Nota:** El script docker/sql/init.sql creará automáticamente la base de datos, las tablas y el usuario administrador al iniciar por primera vez.

## 3. Seguridad y Autenticación
La API utiliza **JSON Web Tokens (JWT)** para proteger las rutas sensibles.

#### _¿Cómo funciona?_
>
>**Login:** El usuario envía sus credenciales. Si son válidas, la API responde con un token.
>

>**Almacenamiento:** En el Frontend, este token se guarda en el localStorage.

>**Uso:** Para acceder a rutas protegidas (como ver tus reservas o el panel de admin), debes enviar el token en las cabeceras de la petición:

## 4. Endpoints Principales
### Autenticación
* POST /api/auth/register - Crear cuenta nueva.
* POST /api/auth/login - Obtener token de acceso.
* POST /api/auth/logout - Limpiar cookies de sesión.

### Viajes y Servicios
* GET /api/viajes - Listado público de viajes.
* GET /api/viajes/[id]/servicios - Detalles de servicios incluidos.

### Usuario (Requiere Token)
* GET /api/reservas - Lista de reservas (Usuarios ven las suyas, Admins todas).
* POST /api/wishlist - Añadir viaje a favoritos.

### Administrador (Requiere Token Admin)
* POST /api/viajes
* POST /api/servicios

## 5. Estructura del Proyecto
* **/app/api**: Rutas y lógica de los endpoints.
* **/config:** Configuración de conexión a la base de datos.
* **/docker:** Scripts SQL y configuración de contenedores.


## 6. Tecnologías
* Framework: Next.js 15
* Base de datos: MySQL 8.0
* Contenedores: Docker
* Seguridad: Bcrypt (Hasing) y JWT (Tokens)