# ✈️ Horizonte Azul — Plataforma de Gestión de Viajes y Reservas Aéreas

> **Hazlo simple, vuela azul**

Horizonte Azul es una plataforma web Full-Stack para la gestión integral de vuelos y reservas aéreas. Diseñada para ofrecer una experiencia rápida, intuitiva y segura tanto para viajeros como para administradores de la aerolínea.

🌐 **Producción:** [horizonte-azul-sand.vercel.app](https://horizonte-azul-sand.vercel.app/)

---

## 📋 Índice

- [Descripción del proyecto](#descripción-del-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Funcionalidades principales](#funcionalidades-principales)
- [Arquitectura](#arquitectura)
- [Puesta en marcha (desarrollo local)](#puesta-en-marcha-desarrollo-local)
- [Variables de entorno](#variables-de-entorno)
- [Despliegue en producción](#despliegue-en-producción)
- [Control de versiones](#control-de-versiones)
- [Autora](#autora)

---

## Descripción del proyecto

Sistema integral para la gestión de vuelos, rutas y servicios adicionales, diseñado para optimizar la logística de Horizonte Azul. La plataforma permite:

- **Usuarios:** buscar destinos, reservar vuelos (ida, vuelta o ambos), gestionar pasajeros, pagar de forma segura y consultar su historial de reservas.
- **Administradores:** gestionar el catálogo de viajes y vuelos, analizar estadísticas de negocio, administrar usuarios y responder consultas de clientes.
- **Asistente IA "Horion":** chatbot integrado con datos reales de la base de datos para orientar al usuario sobre vuelos y destinos disponibles.

---

## Stack tecnológico

| Categoría               | Tecnología                 |
| ----------------------- | -------------------------- |
| Frontend / Backend      | Next.js 16 (App Router)    |
| Biblioteca UI           | React 19                   |
| Lenguaje                | TypeScript                 |
| Estilos                 | Tailwind CSS               |
| Base de datos           | PostgreSQL 15              |
| Hosting BD              | Neon (serverless)          |
| Autenticación           | JWT + bcrypt               |
| Pagos                   | Stripe SDK                 |
| Emails                  | Nodemailer + Google OAuth2 |
| Inteligencia Artificial | Groq SDK (Llama 3.3 70b)   |
| Contenedores            | Docker + Docker Compose    |
| Despliegue              | Vercel                     |
| Control de versiones    | GitHub                     |

---

## Funcionalidades principales

### Usuarios (público y autenticado)

- Catálogo de destinos con buscador y filtros por origen y destino
- Visualización de vuelos disponibles con precios dinámicos
- Proceso de reserva en 4 pasos: pasajeros → resumen → pago → confirmación
- Integración con Stripe (tarjeta, transferencia, PayPal simulado)
- Descarga de factura en PDF al confirmar la reserva
- Área personal estilo "pasaporte digital": reservas, tarjetas, favoritos, consultas
- Sistema de notificaciones internas
- Asistente virtual "Horion" con contexto real de la BD
- Modo oscuro / claro persistente
- Diseño responsive (mobile-first)

### Panel de administración

- Dashboard con KPIs, gráficos de reservas e ingresos
- Gestión CRUD de viajes, vuelos y servicios
- Control de estados de vuelos con recalculado automático
- Gestión de usuarios y roles (isAdmin)
- Sistema de mensajería con notificación por email al usuario
- Herramientas dev: documentación Swagger integrada, catálogo de iconos
- Gestión de banners promocionales

---

## Arquitectura

El proyecto sigue una arquitectura de tres capas integrada en Next.js:

```
Petición del cliente
       ↓
  Route Handler (route.ts)       ← punto de entrada, sin lógica
       ↓
  Controller (/controllers)      ← validación, seguridad, lógica de negocio
       ↓
  Model (/models)                ← consultas SQL parametrizadas a PostgreSQL
       ↓
  Respuesta + servicios externos (Stripe, Nodemailer, Groq)
```

### Estructura de carpetas

```
/horizonte-azul
├── /app
│   ├── /api                    # API Routes (vuelos, reservas, auth, chat...)
│   ├── /api-docs               # Documentación Swagger
│   ├── /(admin)                # Panel de administración
│   ├── /perfil                 # Área personal del usuario
│   └── /viajes/[id]            # Rutas dinámicas de detalle de vuelos
├── /components
│   ├── /admin                  # Tablas y gráficos de gestión
│   ├── /forms                  # Formularios (Login, Registro, Vuelos)
│   ├── /reservas               # Lógica de checkout y PDFs
│   └── /ui                     # Componentes base (ChatBot, Sidebar)
├── /controllers                # Orquestación y lógica de negocio
├── /models                     # Definición de entidades y consultas SQL
├── /lib                        # Utilidades (Stripe, EmailService, Swagger)
├── /context                    # Gestión de estados globales (Auth, Wishlist)
├── /docker                     # Configuración PostgreSQL local
├── middleware.ts               # Control de acceso y seguridad JWT
└── docker-compose.yml          # Orquestación del entorno local
```

---

## Puesta en marcha (desarrollo local)

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución
- [Node.js 20+](https://nodejs.org/) (solo si quieres ejecutar sin Docker)

### 1. Clonar el repositorio

```bash
git clone https://github.com/VallesMarta/horizonte-azul.git
cd horizonte-azul
```

### 2. Configurar las variables de entorno

```bash
cp .env.example .env
```

Rellena los valores en `.env` (ver sección [Variables de entorno](#variables-de-entorno)).

### 3. Levantar el entorno con Docker

```bash
docker-compose up -d
```

Esto levanta automáticamente tres servicios:

- **nextjs_app** → aplicación en [http://localhost:3000](http://localhost:3000)
- **postgres_db** → base de datos en el puerto 5432 (esquema inicializado automáticamente)
- **pgadmin** → interfaz visual de BD en [http://localhost:5050](http://localhost:5050)

> ⚠️ En entorno de desarrollo (Docker), la interfaz cambia a tonos **verdes esmeralda** como indicador visual de que no estás en producción.

### 4. Verificar que todo funciona

```bash
docker ps
```

Deberías ver los tres contenedores con estado `Up`.

---

## Variables de entorno

Copia `.env.example` a `.env` y rellena los siguientes valores:

```env
# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/horizonteAzul
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=horizonteAzul

# Entorno
NEXT_PUBLIC_APP_ENV=develop        # "develop" o "production"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Autenticación
JWT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email (Gmail OAuth2)
EMAIL_FROM=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=

# Inteligencia Artificial
GROQ_API_KEY=

# pgAdmin
PGADMIN_EMAIL=
PGADMIN_PASSWORD=
```

> 🔒 **Nunca subas el archivo `.env` al repositorio.** Está incluido en `.gitignore`.

---

## Despliegue en producción

La aplicación se despliega automáticamente en **Vercel** al hacer push a la rama `main`.

```bash
git checkout main
git merge develop
git push origin main
```

El webhook de Vercel detecta el push y lanza el pipeline de CI/CD. Las variables de entorno de producción se gestionan desde el panel de Vercel (nunca en el código).

La base de datos de producción está alojada en **Neon** (PostgreSQL serverless), conectada mediante `DATABASE_URL` con SSL habilitado.

---

## Control de versiones

El proyecto sigue una estrategia de ramas simple:

| Rama      | Propósito                                                                    |
| --------- | ---------------------------------------------------------------------------- |
| `main`    | Producción. Solo recibe merges desde `develop` cuando el sistema es estable. |
| `develop` | Desarrollo diario. Aquí se integran las nuevas funcionalidades.              |

Las versiones estables se marcan con **Git Tags** anotados:

```bash
git tag -a v6.0.0 -m "Mejoras responsive, depuración efectiva, bugs solventados"
git push origin v6.0.0
```

Los hitos oficiales se publican como **GitHub Releases** con descripción de los cambios incluidos.

---

## Autora

**Marta Vallés Terol**
Desarrolladora Full Stack — 2 DAW Semi · Curso 2025-2026

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Marta_Vallés-blue?style=flat&logo=linkedin)](https://linkedin.com)
[![GitHub](https://img.shields.io/badge/GitHub-VallesMarta-black?style=flat&logo=github)](https://github.com/VallesMarta)

---

_Proyecto Final de Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web._
_© 2026 Horizonte Azul. Todos los derechos reservados._
