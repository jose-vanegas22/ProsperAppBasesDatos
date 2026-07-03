# ProsperApp

Aplicación de gestión de proyectos y tareas. El repositorio está dividido en dos partes independientes:

- **Backend** — API REST hecha con [NestJS](https://nestjs.com/) + [Prisma](https://www.prisma.io/) sobre PostgreSQL.
- **Frontend** — App móvil hecha con [Expo](https://expo.dev/) / React Native.

```
ProsperAPP/
├── Backend/     # API REST (NestJS + Prisma)
├── Frontend/    # App móvil (Expo / React Native)
└── docker-compose.yml   # Base de datos PostgreSQL
```

## Requisitos previos

Antes de empezar asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) 18 o superior
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para la base de datos)
- [Git](https://git-scm.com/)
- La app [Expo Go](https://expo.dev/go) instalada en tu celular (Android o iOS), para probar el frontend

## 1. Clonar el repositorio

```bash
git clone https://github.com/jose-vanegas22/ProsperAppBasesDatos
cd ProsperAPP
```

## 2. Levantar la base de datos con Docker

En la raíz del proyecto:

```bash
docker compose up -d
```

Esto levanta un contenedor de PostgreSQL con los siguientes datos (definidos en `docker-compose.yml`):

| Variable | Valor |
|---|---|
| Usuario | `prosperapp_user` |
| Contraseña | `prosperapp_pass` |
| Base de datos | `prosperapp` |
| Puerto | `5432` |

Para verificar que quedó corriendo:

```bash
docker ps
```

Para detenerla más adelante:

```bash
docker compose down
```

## 3. Configurar y ejecutar el Backend

```bash
cd Backend
npm install
```

### 3.1 Variables de entorno

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

`Backend/.env` debe quedar así (coincide con los datos del `docker-compose.yml`):

```env
DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/prosperapp?schema=public"

JWT_SECRET="cambia_esto_por_un_secreto_seguro"
JWT_EXPIRATION="8h"

PORT=3000
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL. Debe apuntar al contenedor de Docker levantado en el paso 2 |
| `JWT_SECRET` | Secreto usado para firmar los tokens de autenticación. Usa cualquier cadena larga y aleatoria |
| `JWT_EXPIRATION` | Tiempo de expiración del token (ej. `8h`, `1d`) |
| `PORT` | Puerto en el que corre la API |

### 3.2 Migraciones y datos de prueba

```bash
npx prisma migrate dev
```

Esto aplica las migraciones a la base de datos, genera el cliente de Prisma y ejecuta el seed automáticamente (`prisma/seed.ts`) para poblar datos de prueba.

### 3.3 Levantar el servidor

```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api` y la documentación Swagger en:

```
http://localhost:3000/api/docs
```

## 4. Configurar y ejecutar el Frontend

```bash
cd Frontend
npm install
```

### 4.1 Variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Y coloca la **IP local de tu computador** (no `localhost`, porque el celular no la reconoce como su propia máquina):

```env
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000/api
```

**¿Cómo saber tu IP local?**

- Windows: `ipconfig` → busca "Dirección IPv4" de tu adaptador Wi-Fi
- Mac/Linux: `ifconfig` o `ip a` → busca la IP de tu interfaz de red (empieza normalmente por `192.168.` o `10.`)

> Tu celular y tu computador deben estar conectados a la **misma red Wi-Fi** para que la app pueda comunicarse con el backend.
>
> Cada integrante del equipo tiene su propia IP y por lo tanto su propio `Frontend/.env` — este archivo **no se sube a git**, así que no genera conflictos entre compañeros.

### 4.2 Levantar la app

```bash
npm start
```

Esto abre Expo con un código QR:

- **Celular físico:** escanea el QR con la app **Expo Go**
- **Emulador Android:** presiona `a` en la terminal (requiere Android Studio configurado)
- **Simulador iOS:** presiona `i` en la terminal (solo en Mac)

## Resumen rápido

```bash
# 1. Base de datos
docker compose up -d

# 2. Backend
cd Backend
cp .env.example .env    # ajustar valores si es necesario
npm install
npx prisma migrate dev
npm run start:dev

# 3. Frontend (en otra terminal)
cd Frontend
cp .env.example .env    # colocar tu IP local
npm install
npm start
```

## Notas

- El backend debe estar corriendo **antes** de abrir el frontend, ya que la app consume la API en tiempo real.
- Si cambias de red Wi-Fi, recuerda actualizar `EXPO_PUBLIC_API_URL` en tu `Frontend/.env` con la nueva IP.
- Nunca subas tus archivos `.env` a git — ya están ignorados en `.gitignore`, pero ten cuidado si creas archivos nuevos con credenciales.
