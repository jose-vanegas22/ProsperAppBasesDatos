# ProsperApp

> Herramienta inteligente de gestión de proyectos y tareas orientada a trabajadores independientes y pequeños equipos de colaboración.

[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/) [![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/) [![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/) [![Expo](https://img.shields.io/badge/Frontend-Expo-000020?style=flat-square&logo=expo)](https://expo.dev/) [![React Native](https://img.shields.io/badge/Mobile-React_Native-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)

El repositorio se encuentra estructurado y desacoplado en dos componentes independientes que se comunican de forma cliente-servidor:

*   **Backend** — API REST empresarial construida sobre NestJS y Prisma ORM[cite: 1, 3].
*   **Frontend** — Aplicación móvil multiplataforma desarrollada en Expo / React Native[cite: 3].

```hlsl
ProsperAPP/
├── Backend/             # API REST (NestJS + Prisma)
├── Frontend/            # App móvil (Expo / React Native)
└── docker-compose.yml   # Contenedor de base de datos PostgreSQL
```

---

## Requisitos Previos

Antes de iniciar con el despliegue, asegúrate de contar con las siguientes herramientas instaladas en tu equipo:

*   [Node.js](https://nodejs.org/) (Versión 18 o superior)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Necesario para orquestar la base de datos)
*   [Git](https://git-scm.com/) (Control de versiones)
*   La aplicación móvil [Expo Go](https://expo.dev/go) instalada en tu dispositivo físico (Android o iOS) para la previsualización del frontend[cite: 3].

---

## Guía de Instalación y Despliegue

Sigue los pasos descritos a continuación para levantar el entorno de desarrollo local.

### 1. Clonar el repositorio
Abre tu terminal, clona el proyecto y accede al directorio raíz de la aplicación:
```bash
git clone [https://github.com/jose-vanegas22/ProsperAppBasesDatos](https://github.com/jose-vanegas22/ProsperAppBasesDatos)
cd ProsperAPP
```

### 2. Inicializar la Base de Datos con Docker
Desde la raíz del proyecto, ejecutar el siguiente comando en segundo plano[cite: 3]:
```bash
docker compose up -d
```

Esto inicializará una instancia dedicada de **PostgreSQL** utilizando las credenciales preconfiguradas en el archivo `docker-compose.yml`[cite: 3]:

| Parámetro | Valor Predeterminado |
| :--- | :--- |
| **Usuario** | `prosperapp_user` |
| **Contraseña** | `prosperapp_pass` |
| **Base de Datos** | `prosperapp` |
| **Puerto Local** | `5432` |

>  **Comandos útiles de diagnóstico:**
> *   Para verificar si el contenedor está corriendo correctamente usa: `docker ps`
> *   Para detener por completo el contenedor de la base de datos utiliza: `docker compose down`

### 3. Configurar y Ejecutar el Backend
Desplázate al directorio del servidor e instala todos los paquetes necesarios de Node[cite: 3]:
```bash
cd Backend
npm install
```

#### Configuración de Variables de Entorno
Genera tu archivo de configuración local a partir de la plantilla de ejemplo[cite: 3]:
```bash
cp .env.example .env
```

Abre el archivo `Backend/.env` recién creado y asegúrate de que contenga los valores correspondientes para conectarse al contenedor Docker:
```env
DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/prosperapp?schema=public"

JWT_SECRET="cambia_esto_por_un_secreto_seguro"
JWT_EXPIRATION="8h"

PORT=3000
```

| Variable | Descripción |
| :--- | :--- |
| `DATABASE_URL` | String de conexión a PostgreSQL. Debe apuntar al contenedor de Docker levantado en el paso 2. |
| `JWT_SECRET` | Clave secreta para la firma segura de tokens de sesión. Usa una cadena alfanumérica larga[cite: 1, 3]. |
| `JWT_EXPIRATION` | Periodo de vigencia de la sesión del usuario (ej. `8h`, `1d`). |
| `PORT` | Puerto de escucha en el que se levantará el servidor HTTP local. |

#### Sincronización de Base de Datos y Datos de Prueba
Aplica las migraciones estructurales, genera el cliente de datos y ejecuta los scripts de poblado inicial (*seeds*)[cite: 1, 3]:
```bash
npx prisma migrate dev
```

> **Nota:** Este comando estructurará el esquema relacional en PostgreSQL y cargará de forma automática los registros de prueba simulados definidos en `prisma/seed.ts`[cite: 1, 3].

#### Iniciar Servidor en Modo Desarrollo
```bash
npm run start:dev
```

La API REST quedará totalmente funcional en el endpoint `http://localhost:3000/api`. Puedes validar y probar sus rutas desde la documentación interactiva de Swagger integrada en[cite: 3]:
```text
http://localhost:3000/api/docs
```

### 4. Configurar y Ejecutar el Frontend
Abre una nueva terminal en paralelo, navega a la carpeta de la interfaz móvil e instala las dependencias[cite: 3]:
```bash
cd Frontend
npm install
```

#### Configuración de Variables de Entorno
Clona la plantilla de entorno del cliente[cite: 3]:
```bash
cp .env.example .env
```

Edita el archivo `Frontend/.env` asignando la **dirección IP local de tu ordenador** en lugar de usar `localhost` (los dispositivos móviles externos o emuladores no identifican `localhost` como tu PC)[cite: 3]:
```env
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000/api
```

 **¿Cómo consultar tu IP local de red?**
*   **Windows:** Ejecuta `ipconfig` en la consola y localiza la *Dirección IPv4* de tu adaptador Wi-Fi activo.
*   **Mac / Linux:** Ejecuta `ifconfig` o `ip a` en la terminal y busca la dirección IP de tu interfaz inalámbrica (usualmente inicia con `192.168.` o `10.`).

> **Restricción de Red:** Tu celular físico y tu PC deben estar conectados obligatoriamente a la **misma red Wi-Fi** para que exista comunicación con el backend[cite: 3].
> 
> **Privacidad:** La IP de red cambia por desarrollador. Este archivo `.env` está protegido e ignorado en Git mediante `.gitignore` para prevenir colisiones de código entre compañeros de equipo.

#### Iniciar la Aplicación Móvil
Lanza el empaquetador de Expo para compilar el proyecto[cite: 3]:
```bash
npm start
```

Se mostrará un código QR en tu terminal. Elige el entorno de visualización de tu preferencia[cite: 3]:
*   **Dispositivo Físico:** Escanea el código directamente usando la app móvil **Expo Go** (Android) o la cámara nativa (iOS)[cite: 3].
*   **Emulador Android:** Presiona la tecla `a` en la consola (Requiere Android Studio configurado con una máquina virtual)[cite: 3].
*   **Simulador iOS:** Presiona la tecla `i` en la consola (Disponible exclusivamente en ordenadores macOS)[cite: 3].

---

## Resumen Rápido de Comandos

Si los archivos de configuración ya están creados, inicializa el entorno completo ejecutando este set rápido:

```bash
# 1. Levantar contenedor de base de datos
docker compose up -d

# 2. Inicializar el Backend (Terminal 1)
cd Backend
cp .env.example .env     # Ajustar valores si es la primera vez
npm install
npx prisma migrate dev
npm run start:dev

# 3. Inicializar el Frontend (Terminal 2)
cd Frontend
cp .env.example .env     # Colocar tu IP local actual
npm install
npm start
```

---

## Notas Importantes

*   **Orden de Ejecución:** El servidor Backend debe encontrarse arriba y escuchando conexiones **antes** de inicializar el Frontend para evitar errores de red y sincronización en la pantalla de autenticación.
*   **Cambios de Locación:** Si trabajas desde otra ubicación física u otra red Wi-Fi, tu IP local cambiará. No olvides actualizar la variable `EXPO_PUBLIC_API_URL` en tu archivo `Frontend/.env`[cite: 3].
*   **Seguridad de Credenciales:** Protege siempre tus contraseñas y llaves de cifrado. Jamás subas archivos de extensión `.env` al histórico de Git. Las plantillas `.env.example` proveen la estructura modelo requerida.
```
