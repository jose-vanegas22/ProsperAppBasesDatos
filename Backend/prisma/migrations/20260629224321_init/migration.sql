-- CreateTable
CREATE TABLE "usuario" (
    "usuario_id" SERIAL NOT NULL,
    "primer_nombre" VARCHAR(50) NOT NULL,
    "segundo_nombre" VARCHAR(50),
    "primer_apellido" VARCHAR(50) NOT NULL,
    "segundo_apellido" VARCHAR(50),
    "email" VARCHAR(50) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_nacimiento" DATE NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_desactivado" TIMESTAMP(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "proyecto" (
    "proyecto_id" SERIAL NOT NULL,
    "nombre_proyecto" VARCHAR(100) NOT NULL,
    "estado_proyecto" BOOLEAN NOT NULL DEFAULT true,
    "fecha_inicio" DATE NOT NULL,
    "fecha_limite" DATE,
    "usuario_creadorid" INTEGER NOT NULL,

    CONSTRAINT "proyecto_pkey" PRIMARY KEY ("proyecto_id")
);

-- CreateTable
CREATE TABLE "usuario_proyecto" (
    "usuario_colaboradorid" INTEGER NOT NULL,
    "proyecto_id" INTEGER NOT NULL,
    "fecha_union" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_proyecto_pkey" PRIMARY KEY ("usuario_colaboradorid","proyecto_id")
);

-- CreateTable
CREATE TABLE "seccion" (
    "seccion_id" SERIAL NOT NULL,
    "nombre_seccion" VARCHAR(50) NOT NULL,
    "color" VARCHAR(20) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_desactivado" TIMESTAMP(3),
    "fecha_actualizacion" TIMESTAMP(3),
    "activo_seccion" BOOLEAN NOT NULL DEFAULT true,
    "proyecto_id" INTEGER NOT NULL,

    CONSTRAINT "seccion_pkey" PRIMARY KEY ("seccion_id")
);

-- CreateTable
CREATE TABLE "tarea" (
    "tarea_id" SERIAL NOT NULL,
    "nombre_tarea" VARCHAR(150) NOT NULL,
    "descripcion_tarea" TEXT NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_limite" DATE NOT NULL,
    "fecha_desactivado" TIMESTAMP(3),
    "activo_tarea" BOOLEAN NOT NULL DEFAULT true,
    "prioridad" INTEGER NOT NULL,
    "seccion_id" INTEGER,

    CONSTRAINT "tarea_pkey" PRIMARY KEY ("tarea_id")
);

-- CreateTable
CREATE TABLE "tipo_contenido" (
    "tipo_contenidoid" SERIAL NOT NULL,
    "nombre_tipo_contenido" VARCHAR(50) NOT NULL,

    CONSTRAINT "tipo_contenido_pkey" PRIMARY KEY ("tipo_contenidoid")
);

-- CreateTable
CREATE TABLE "contenido" (
    "contenido_id" SERIAL NOT NULL,
    "descripcion_contenido" TEXT NOT NULL,
    "estado_contenido" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),
    "fecha_desactivado" TIMESTAMP(3),
    "tarea_id" INTEGER NOT NULL,
    "tipo_contenidoid" INTEGER NOT NULL,

    CONSTRAINT "contenido_pkey" PRIMARY KEY ("contenido_id")
);

-- CreateTable
CREATE TABLE "subtarea" (
    "subtarea_id" SERIAL NOT NULL,
    "descripcion_subtarea" TEXT NOT NULL,
    "estado_subtarea" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),
    "tarea_id" INTEGER,

    CONSTRAINT "subtarea_pkey" PRIMARY KEY ("subtarea_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "proyecto" ADD CONSTRAINT "proyecto_usuario_creadorid_fkey" FOREIGN KEY ("usuario_creadorid") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_proyecto" ADD CONSTRAINT "usuario_proyecto_usuario_colaboradorid_fkey" FOREIGN KEY ("usuario_colaboradorid") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_proyecto" ADD CONSTRAINT "usuario_proyecto_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyecto"("proyecto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seccion" ADD CONSTRAINT "seccion_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyecto"("proyecto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarea" ADD CONSTRAINT "tarea_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "seccion"("seccion_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contenido" ADD CONSTRAINT "contenido_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "tarea"("tarea_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contenido" ADD CONSTRAINT "contenido_tipo_contenidoid_fkey" FOREIGN KEY ("tipo_contenidoid") REFERENCES "tipo_contenido"("tipo_contenidoid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subtarea" ADD CONSTRAINT "subtarea_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "tarea"("tarea_id") ON DELETE SET NULL ON UPDATE CASCADE;
