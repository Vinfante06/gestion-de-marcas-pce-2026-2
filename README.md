# Registro de Contactos — Marcas PCE

App para capturar y hacer seguimiento de contactos de marca por evento.
Next.js + Prisma + Postgres (Neon), lista para desplegar en Vercel desde GitHub.

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar la base de datos (desarrollo local)

1. Crea una cuenta gratis en [neon.tech](https://neon.tech) (o usa cualquier Postgres).
2. Copia la cadena de conexión que te dan.
3. Copia `.env.example` como `.env.local` y pega ahí tu cadena de conexión:

```bash
cp .env.example .env.local
```     

4. Crea las tablas en la base de datos:

```bash
npx prisma db push
```

## 3. Correr en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 4. Subir a GitHub

```bash
git init
git add .
git commit -m "Primera versión: registro de contactos"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/marcas-pce-app.git
git push -u origin main
```

> Nota: `.env.local` NUNCA se sube (ya está en `.gitignore`).

## 5. Desplegar en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New Project** → importa tu repo de GitHub.
2. Antes de darle deploy, ve a **Storage** → **Marketplace** → instala **Neon** (o conecta el mismo proyecto de Neon que creaste en el paso 2).
3. Vercel inyecta automáticamente la variable `DATABASE_URL` en el proyecto.
4. Dale **Deploy**.
5. La primera vez, corre la migración contra la base de datos de producción (puedes hacerlo desde tu máquina apuntando al `.env` de producción, o agregar `prisma db push` a un script de build):

```bash
npx prisma db push
```

Cada vez que hagas `git push` a `main`, Vercel vuelve a desplegar automáticamente.

## Estructura del proyecto

```
prisma/schema.prisma        → modelo de datos (tabla Contacto)
src/app/page.tsx             → página principal
src/app/api/contactos/       → API: crear, listar, editar, eliminar
src/components/              → formulario, pipeline de estado, tabla
src/lib/                     → cliente de Prisma, catálogos, exportar Excel
```
