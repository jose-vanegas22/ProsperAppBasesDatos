-- ============================================================
-- ProsperApp – DDL: Creación de tablas
-- ============================================================

DROP TABLE IF EXISTS subtarea          CASCADE;
DROP TABLE IF EXISTS contenido         CASCADE;
DROP TABLE IF EXISTS tipo_contenido    CASCADE;
DROP TABLE IF EXISTS tarea             CASCADE;
DROP TABLE IF EXISTS seccion           CASCADE;
DROP TABLE IF EXISTS usuario_proyecto  CASCADE;
DROP TABLE IF EXISTS proyecto          CASCADE;
DROP TABLE IF EXISTS usuario           CASCADE;

-- ------------------------------------------------------------
CREATE TABLE usuario (
  usuario_id        SERIAL          PRIMARY KEY,
  primer_nombre     VARCHAR(50)     NOT NULL,
  segundo_nombre    VARCHAR(50),
  primer_apellido   VARCHAR(50)     NOT NULL,
  segundo_apellido  VARCHAR(50),
  email             VARCHAR(50)     NOT NULL UNIQUE,
  contrasena        VARCHAR(255)    NOT NULL,
  activo            BOOLEAN         NOT NULL DEFAULT TRUE,
  fecha_nacimiento  DATE            NOT NULL,
  fecha_creacion    TIMESTAMP       NOT NULL DEFAULT NOW(),
  fecha_desactivado TIMESTAMP
);

-- ------------------------------------------------------------
CREATE TABLE proyecto (
  proyecto_id      SERIAL       PRIMARY KEY,
  nombre_proyecto  VARCHAR(100) NOT NULL,
  estado_proyecto  BOOLEAN      NOT NULL DEFAULT TRUE,
  fecha_inicio     DATE         NOT NULL,
  fecha_limite     DATE,
  usuario_creadorid INT         NOT NULL REFERENCES usuario(usuario_id)
);

-- ------------------------------------------------------------
CREATE TABLE usuario_proyecto (
  usuario_colaboradorid INT  NOT NULL REFERENCES usuario(usuario_id),
  proyecto_id           INT  NOT NULL REFERENCES proyecto(proyecto_id),
  fecha_union           DATE NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (usuario_colaboradorid, proyecto_id)
);

-- ------------------------------------------------------------
CREATE TABLE seccion (
  seccion_id          SERIAL      PRIMARY KEY,
  nombre_seccion      VARCHAR(50) NOT NULL,
  color               VARCHAR(20) NOT NULL,
  fecha_creacion      TIMESTAMP   NOT NULL DEFAULT NOW(),
  fecha_desactivado   TIMESTAMP,
  fecha_actualizacion TIMESTAMP,
  activo_seccion      BOOLEAN     NOT NULL DEFAULT TRUE,
  proyecto_id         INT         NOT NULL REFERENCES proyecto(proyecto_id)
);

-- ------------------------------------------------------------
CREATE TABLE tarea (
  tarea_id          SERIAL       PRIMARY KEY,
  nombre_tarea      VARCHAR(150) NOT NULL,
  descripcion_tarea TEXT         NOT NULL,
  fecha_inicio      DATE         NOT NULL,
  fecha_limite      DATE         NOT NULL,
  fecha_desactivado TIMESTAMP,
  activo_tarea      BOOLEAN      NOT NULL DEFAULT TRUE,
  prioridad         INT          NOT NULL,
  seccion_id        INT          REFERENCES seccion(seccion_id)
);

-- ------------------------------------------------------------
CREATE TABLE tipo_contenido (
  tipo_contenidoid      SERIAL      PRIMARY KEY,
  nombre_tipo_contenido VARCHAR(50) NOT NULL
);

-- ------------------------------------------------------------
CREATE TABLE contenido (
  contenido_id          SERIAL    PRIMARY KEY,
  descripcion_contenido TEXT      NOT NULL,
  estado_contenido      BOOLEAN   NOT NULL DEFAULT TRUE,
  fecha_creacion        TIMESTAMP NOT NULL DEFAULT NOW(),
  fecha_actualizacion   TIMESTAMP,
  fecha_desactivado     TIMESTAMP,
  tarea_id              INT       NOT NULL REFERENCES tarea(tarea_id),
  tipo_contenidoid      INT       NOT NULL REFERENCES tipo_contenido(tipo_contenidoid)
);

-- ------------------------------------------------------------
CREATE TABLE subtarea (
  subtarea_id          SERIAL    PRIMARY KEY,
  descripcion_subtarea TEXT      NOT NULL,
  estado_subtarea      BOOLEAN   NOT NULL DEFAULT FALSE,
  fecha_creacion       TIMESTAMP NOT NULL DEFAULT NOW(),
  fecha_actualizacion  TIMESTAMP,
  tarea_id             INT       REFERENCES tarea(tarea_id)
);
