# Guía de Contribución — Horizonte Azul

Gracias por tu interés en contribuir a Horizonte Azul. Este documento describe las normas y el flujo de trabajo que deben seguirse para mantener el código organizado, seguro y fácil de mantener.

---

## Índice

- [Código de conducta](#código-de-conducta)
- [Antes de empezar](#antes-de-empezar)
- [Estrategia de ramas](#estrategia-de-ramas)
- [Flujo de trabajo estándar](#flujo-de-trabajo-estándar)
- [Convenciones de commits](#convenciones-de-commits)
- [Configuración del entorno local](#configuración-del-entorno-local)
- [Normas de seguridad](#normas-de-seguridad-obligatorias)
- [Proceso de revisión](#proceso-de-revisión)

---

## Código de conducta

Este proyecto es un trabajo académico individual. Cualquier colaboración externa (revisión, sugerencia o corrección) debe realizarse con respeto, constructividad y sin modificar directamente la rama `main`.

---

## Antes de empezar

1. Asegúrate de tener instalado **Docker Desktop** y **Node.js 20+**.
2. Consulta los issues abiertos antes de empezar a trabajar en algo nuevo, para evitar duplicidades.
3. Si vas a implementar una nueva funcionalidad o corregir un bug, **abre primero un Issue** describiendo qué vas a hacer y por qué.

---

## Estrategia de ramas

El repositorio usa dos ramas principales:

```
main       ← producción (protegida, solo merges desde develop)
develop    ← integración y pruebas diarias
```

**Reglas:**
- **Nunca** trabajes directamente sobre `main`.
- Todo el desarrollo se realiza en `develop` o en ramas de feature derivadas de ella.
- Solo se fusiona código a `main` cuando el sistema ha sido probado completamente en local y en el entorno de desarrollo de Vercel (rama `develop`).

### Ramas de feature (opcional para colaboraciones)

Si trabajas en una funcionalidad concreta, puedes crear una rama específica desde `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-funcionalidad
```

Una vez completada, abre una Pull Request hacia `develop` (nunca hacia `main`).

---

## Flujo de trabajo estándar

```bash
# 1. Sincronizar con el estado actual de develop
git checkout develop
git pull origin develop

# 2. Hacer los cambios necesarios en el código

# 3. Comprobar que el entorno Docker funciona correctamente
docker-compose up -d
# Verificar en http://localhost:3000

# 4. Añadir los cambios al staging
git add .

# 5. Hacer el commit siguiendo la convención (ver sección siguiente)
git commit -m "feat: descripción clara del cambio"

# 6. Subir a develop
git push origin develop

# 7. Solo cuando develop es estable → fusionar a main
git checkout main
git merge develop
git push origin main
```

---

## Convenciones de commits

Usa el formato de **Conventional Commits** para mantener un historial legible:

```
<tipo>: <descripción breve en español>
```

**Ejemplos:**

```bash
git commit -m "añadir filtro por fecha en el catálogo de vuelos"
git commit -m "corregir cálculo de precio total cuando hay extras"
git commit -m "separar lógica de emails en emailActions.ts"
git commit -m "actualizar README con instrucciones de Docker"
git commit -m "migrar de MySQL a PostgreSQL (#18)"
```

> Cuando un commit resuelve un Issue, añade la referencia al final: `(#número)`.

---

## Configuración del entorno local

Para desarrollar en local es **obligatorio** usar Docker. No se garantiza compatibilidad con instalaciones directas de PostgreSQL en el sistema operativo anfitrión.

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/VallesMarta/horizonte-azul.git
cd horizonte-azul

# Copiar las variables de entorno
cp .env.example .env
# → Editar .env con los valores necesarios

# Levantar los contenedores
docker-compose up -d

# Verificar que los tres servicios están activos
docker ps
```

Los servicios disponibles en local son:

| Servicio | URL |
|---|---|
| Aplicación Next.js | http://localhost:3000 |
| pgAdmin (gestión BD) | http://localhost:5050 |
| PostgreSQL | localhost:5432 |

> La interfaz en modo desarrollo aparece en **verde esmeralda** de forma intencionada, para diferenciarla visualmente de la versión de producción (azul corporativo).

### Parar el entorno

```bash
docker-compose down
```

Los datos de la base de datos se conservan gracias al volumen persistente `postgres_data`.

---

## Normas de seguridad (obligatorias)

> ⛔ El incumplimiento de estas normas puede comprometer la seguridad del sistema y de los usuarios.

1. **Nunca subas el archivo `.env`** al repositorio. Está en `.gitignore`, pero compruébalo antes de cada push.
2. **Nunca escribas credenciales, claves de API o tokens directamente en el código.** Usa siempre las variables de entorno.
3. Las variables de entorno de producción se configuran exclusivamente en el panel de **Vercel** → Environment Variables. Nunca en el código fuente.
4. No compartas ni publiques valores de `JWT_SECRET`, `STRIPE_SECRET_KEY`, `GROQ_API_KEY` ni credenciales de Google OAuth2.
5. Si detectas una vulnerabilidad de seguridad, **no abras un Issue público**. Contacta directamente con la autora del proyecto.

---

## Proceso de revisión

1. Abre un **Pull Request** desde tu rama hacia `develop` con una descripción clara de los cambios.
2. Incluye capturas de pantalla si hay cambios visuales.
3. El PR será revisado antes de fusionarse. No hagas merge sin revisión.
4. Si el PR resuelve uno o más Issues, menciónalos en la descripción: `Closes #12`.

---

*Horizonte Azul — Proyecto Final DAW · Marta Vallés Terol · 2025-2026*