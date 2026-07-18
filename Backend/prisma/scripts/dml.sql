-- ============================================================
-- ProsperApp – DML: Datos de prueba
-- ============================================================

-- USUARIO
INSERT INTO usuario (usuario_id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, email, contrasena, activo, fecha_nacimiento, fecha_creacion) VALUES
(1, 'Juan',   'Camilo', 'Perez',   'Diaz',  'juan.perez@email.com',    'juanperez',    TRUE,  '1998-03-15', '2026-01-10 09:00:00'),
(2, 'Maria',  'Jose',   'Gomez',   'Ruiz',  'maria.gomez@email.com',   'mariagomez',   TRUE,  '1999-07-22', '2026-01-12 10:30:00'),
(3, 'Pedro',  NULL,     'Ramirez', NULL,    'pedro.ramirez@email.com', 'pedroramirez', TRUE,  '1997-11-05', '2026-01-15 14:00:00'),
(4, 'Laura',  'Sofia',  'Castro',  'Munoz', 'laura.castro@email.com',  'lauracastro',  TRUE,  '2000-02-28', '2026-02-01 08:15:00'),
(5, 'Andres', NULL,     'Lopez',   NULL,    'andres.lopez@email.com',  'andreslopez',  FALSE, '1996-09-10', '2026-02-03 16:45:00');

-- PROYECTO
INSERT INTO proyecto (proyecto_id, nombre_proyecto, estado_proyecto, fecha_inicio, fecha_limite, usuario_creadorid) VALUES
(1, 'App de Recetas',        TRUE, '2026-01-15', '2026-08-30', 2),
(2, 'ProsperApp Tracker',    TRUE, '2026-02-01', '2026-12-15', 1),
(3, 'Bot de Notificaciones', TRUE, '2026-03-01', NULL,         3);

-- USUARIO_PROYECTO
INSERT INTO usuario_proyecto (usuario_colaboradorid, proyecto_id, fecha_union) VALUES
(1, 1, '2026-01-20'),
(4, 1, '2026-01-22'),
(2, 2, '2026-02-05'),
(4, 3, '2026-03-03');

-- SECCION
INSERT INTO seccion (seccion_id, nombre_seccion, color, fecha_creacion, proyecto_id) VALUES
(1, 'Backlog',   '#9CA3AF', '2026-01-15 09:00:00', 1),
(2, 'Doing',     '#FBBF24', '2026-01-15 09:00:00', 1),
(3, 'Completed', '#34D399', '2026-01-15 09:00:00', 1),
(4, 'Backlog',   '#9CA3AF', '2026-02-01 09:00:00', 2),
(5, 'Doing',     '#FBBF24', '2026-02-01 09:00:00', 2),
(6, 'Release',   '#60A5FA', '2026-02-01 09:00:00', 2),
(7, 'Backlog',   '#9CA3AF', '2026-03-01 09:00:00', 3),
(8, 'Doing',     '#FBBF24', '2026-03-01 09:00:00', 3);

-- TAREA
INSERT INTO tarea (tarea_id, nombre_tarea, descripcion_tarea, fecha_inicio, fecha_limite, activo_tarea, prioridad, seccion_id) VALUES
(1, 'Login de usuarios',          'Permitir inicio de sesion con email y contrasena',          '2026-01-16', '2026-02-01', TRUE, 1, 2),
(2, 'Listado de recetas',         'Mostrar recetas guardadas por el usuario',                  '2026-01-18', '2026-02-10', TRUE, 2, 1),
(3, 'Subir foto de receta',       'Permitir adjuntar imagen a cada receta',                    '2026-01-20', '2026-02-15', TRUE, 3, 1),
(4, 'Dashboard de proyectos',     'Vista principal con resumen de progreso',                   '2026-02-02', '2026-03-01', TRUE, 1, 5),
(5, 'Drag and drop de tareas',    'Permitir mover tareas entre secciones arrastrando',         '2026-02-05', '2026-03-10', TRUE, 2, 4),
(6, 'Conexion API notificaciones','Integrar servicio externo de envio de mensajes',            '2026-03-02', '2026-04-01', TRUE, 1, 8);

-- TIPO_CONTENIDO
INSERT INTO tipo_contenido (tipo_contenidoid, nombre_tipo_contenido) VALUES
(1, 'Descripcion detallada'),
(2, 'Nota de diseno'),
(3, 'Fragmento de codigo'),
(4, 'Decision tecnica');

-- CONTENIDO
INSERT INTO contenido (contenido_id, descripcion_contenido, estado_contenido, fecha_creacion, tarea_id, tipo_contenidoid) VALUES
(1, 'Como usuario quiero iniciar sesion para acceder a mi cuenta de forma segura.',           TRUE, '2026-01-16 10:00:00', 1, 1),
(2, 'El boton de login debe ir centrado, color azul, con esquinas redondeadas.',              TRUE, '2026-01-16 11:00:00', 1, 2),
(3, 'SELECT * FROM usuario WHERE email = $1 AND contrasena = $2;',                            TRUE, '2026-01-17 09:30:00', 1, 3),
(4, 'Se decidio usar JWT en vez de sesiones en servidor para mantener el sistema sin estado.',TRUE, '2026-01-17 15:00:00', 1, 4),
(5, 'Las recetas deben mostrarse en tarjetas ordenadas por fecha de creacion.',               TRUE, '2026-01-19 08:00:00', 2, 1);

-- SUBTAREA
INSERT INTO subtarea (subtarea_id, descripcion_subtarea, estado_subtarea, fecha_creacion, fecha_actualizacion, tarea_id) VALUES
(1, 'Crear formulario de login', TRUE,  '2026-01-16 09:00:00', NULL, 1),
(2, 'Validar formato de email',  TRUE,  '2026-01-16 09:05:00', NULL, 1),
(3, 'Conectar con base de datos',FALSE, '2026-01-16 09:10:00', NULL, 1),
(4, 'Manejar mensajes de error', FALSE, '2026-01-16 09:15:00', NULL, 1),
(5, 'Disenar tarjeta de receta', TRUE,  '2026-01-18 10:00:00', NULL, 2),
(6, 'Implementar paginacion',    FALSE, '2026-01-18 10:05:00', NULL, 2);

-- Actualizar secuencias para evitar conflictos con el autoincrement
SELECT setval('usuario_usuario_id_seq',        (SELECT MAX(usuario_id)       FROM usuario));
SELECT setval('proyecto_proyecto_id_seq',       (SELECT MAX(proyecto_id)      FROM proyecto));
SELECT setval('seccion_seccion_id_seq',         (SELECT MAX(seccion_id)       FROM seccion));
SELECT setval('tarea_tarea_id_seq',             (SELECT MAX(tarea_id)         FROM tarea));
SELECT setval('tipo_contenido_tipo_contenidoid_seq', (SELECT MAX(tipo_contenidoid) FROM tipo_contenido));
SELECT setval('contenido_contenido_id_seq',     (SELECT MAX(contenido_id)     FROM contenido));
SELECT setval('subtarea_subtarea_id_seq',        (SELECT MAX(subtarea_id)      FROM subtarea));
