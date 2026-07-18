import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar en orden inverso para respetar FK
  await prisma.subtarea.deleteMany();
  await prisma.contenido.deleteMany();
  await prisma.tipoContenido.deleteMany();
  await prisma.tarea.deleteMany();
  await prisma.seccion.deleteMany();
  await prisma.usuarioProyecto.deleteMany();
  await prisma.proyecto.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('Base de datos limpia, insertando datos...');

  // TIPO_CONTENIDO
  const [descDetallada, notaDiseno, fragmentoCodigo, decisionTecnica] =
    await Promise.all([
      prisma.tipoContenido.create({ data: { nombreTipoContenido: 'Descripcion detallada' } }),
      prisma.tipoContenido.create({ data: { nombreTipoContenido: 'Nota de diseno' } }),
      prisma.tipoContenido.create({ data: { nombreTipoContenido: 'Fragmento de codigo' } }),
      prisma.tipoContenido.create({ data: { nombreTipoContenido: 'Decision tecnica' } }),
    ]);

  // USUARIOS (con contraseñas hasheadas)
  const hashes = await Promise.all([
    bcrypt.hash('juanperez', 10),
    bcrypt.hash('mariagomez', 10),
    bcrypt.hash('pedroramirez', 10),
    bcrypt.hash('lauracastro', 10),
    bcrypt.hash('andreslopez', 10),
  ]);

  const [juan, maria, pedro, laura, _andres] = await Promise.all([
    prisma.usuario.create({
      data: {
        primerNombre: 'Juan', segundoNombre: 'Camilo',
        primerApellido: 'Perez', segundoApellido: 'Diaz',
        email: 'juan.perez@email.com', contrasena: hashes[0],
        activo: true, fechaNacimiento: new Date('1998-03-15'),
        fechaCreacion: new Date('2026-01-10T09:00:00'),
      },
    }),
    prisma.usuario.create({
      data: {
        primerNombre: 'Maria', segundoNombre: 'Jose',
        primerApellido: 'Gomez', segundoApellido: 'Ruiz',
        email: 'maria.gomez@email.com', contrasena: hashes[1],
        activo: true, fechaNacimiento: new Date('1999-07-22'),
        fechaCreacion: new Date('2026-01-12T10:30:00'),
      },
    }),
    prisma.usuario.create({
      data: {
        primerNombre: 'Pedro',
        primerApellido: 'Ramirez',
        email: 'pedro.ramirez@email.com', contrasena: hashes[2],
        activo: true, fechaNacimiento: new Date('1997-11-05'),
        fechaCreacion: new Date('2026-01-15T14:00:00'),
      },
    }),
    prisma.usuario.create({
      data: {
        primerNombre: 'Laura', segundoNombre: 'Sofia',
        primerApellido: 'Castro', segundoApellido: 'Munoz',
        email: 'laura.castro@email.com', contrasena: hashes[3],
        activo: true, fechaNacimiento: new Date('2000-02-28'),
        fechaCreacion: new Date('2026-02-01T08:15:00'),
      },
    }),
    prisma.usuario.create({
      data: {
        primerNombre: 'Andres',
        primerApellido: 'Lopez',
        email: 'andres.lopez@email.com', contrasena: hashes[4],
        activo: false, fechaNacimiento: new Date('1996-09-10'),
        fechaCreacion: new Date('2026-02-03T16:45:00'),
      },
    }),
  ]);

  // PROYECTOS
  const [appRecetas, prosperTracker, botNotif] = await Promise.all([
    prisma.proyecto.create({
      data: {
        nombreProyecto: 'App de Recetas',
        fechaInicio: new Date('2026-01-15'),
        fechaLimite: new Date('2026-08-30'),
        usuarioCreadorId: maria.usuarioId,
      },
    }),
    prisma.proyecto.create({
      data: {
        nombreProyecto: 'ProsperApp Tracker',
        fechaInicio: new Date('2026-02-01'),
        fechaLimite: new Date('2026-12-15'),
        usuarioCreadorId: juan.usuarioId,
      },
    }),
    prisma.proyecto.create({
      data: {
        nombreProyecto: 'Bot de Notificaciones',
        fechaInicio: new Date('2026-03-01'),
        usuarioCreadorId: pedro.usuarioId,
      },
    }),
  ]);

  // USUARIO_PROYECTO (colaboradores)
  await Promise.all([
    prisma.usuarioProyecto.create({
      data: { usuarioColaboradorId: juan.usuarioId,   proyectoId: appRecetas.proyectoId,    fechaUnion: new Date('2026-01-20') },
    }),
    prisma.usuarioProyecto.create({
      data: { usuarioColaboradorId: laura.usuarioId,  proyectoId: appRecetas.proyectoId,    fechaUnion: new Date('2026-01-22') },
    }),
    prisma.usuarioProyecto.create({
      data: { usuarioColaboradorId: maria.usuarioId,  proyectoId: prosperTracker.proyectoId, fechaUnion: new Date('2026-02-05') },
    }),
    prisma.usuarioProyecto.create({
      data: { usuarioColaboradorId: laura.usuarioId,  proyectoId: botNotif.proyectoId,      fechaUnion: new Date('2026-03-03') },
    }),
  ]);

  // SECCIONES
  const [, doing1, , , doing2, , , doing3] = await Promise.all([
    prisma.seccion.create({ data: { nombreSeccion: 'Backlog',   color: '#9CA3AF', proyectoId: appRecetas.proyectoId,     fechaCreacion: new Date('2026-01-15T09:00:00') } }),
    prisma.seccion.create({ data: { nombreSeccion: 'Doing',     color: '#FBBF24', proyectoId: appRecetas.proyectoId,     fechaCreacion: new Date('2026-01-15T09:00:00') } }),
    prisma.seccion.create({ data: { nombreSeccion: 'Completed', color: '#34D399', proyectoId: appRecetas.proyectoId,     fechaCreacion: new Date('2026-01-15T09:00:00') } }),
    prisma.seccion.create({ data: { nombreSeccion: 'Backlog',   color: '#9CA3AF', proyectoId: prosperTracker.proyectoId, fechaCreacion: new Date('2026-02-01T09:00:00') } }),
    prisma.seccion.create({ data: { nombreSeccion: 'Doing',     color: '#FBBF24', proyectoId: prosperTracker.proyectoId, fechaCreacion: new Date('2026-02-01T09:00:00') } }),
    prisma.seccion.create({ data: { nombreSeccion: 'Release',   color: '#60A5FA', proyectoId: prosperTracker.proyectoId, fechaCreacion: new Date('2026-02-01T09:00:00') } }),
    prisma.seccion.create({ data: { nombreSeccion: 'Backlog',   color: '#9CA3AF', proyectoId: botNotif.proyectoId,       fechaCreacion: new Date('2026-03-01T09:00:00') } }),
    prisma.seccion.create({ data: { nombreSeccion: 'Doing',     color: '#FBBF24', proyectoId: botNotif.proyectoId,       fechaCreacion: new Date('2026-03-01T09:00:00') } }),
  ]);

  // TAREAS
  const [loginTask, recetasTask] = await Promise.all([
    prisma.tarea.create({
      data: {
        nombreTarea: 'Login de usuarios',
        descripcionTarea: 'Permitir inicio de sesion con email y contrasena',
        fechaInicio: new Date('2026-01-16'), fechaLimite: new Date('2026-02-01'),
        prioridad: 1, seccionId: doing1.seccionId,
      },
    }),
    prisma.tarea.create({
      data: {
        nombreTarea: 'Listado de recetas',
        descripcionTarea: 'Mostrar recetas guardadas por el usuario',
        fechaInicio: new Date('2026-01-18'), fechaLimite: new Date('2026-02-10'),
        prioridad: 2, seccionId: appRecetas.proyectoId,
      },
    }),
    prisma.tarea.create({
      data: {
        nombreTarea: 'Subir foto de receta',
        descripcionTarea: 'Permitir adjuntar imagen a cada receta',
        fechaInicio: new Date('2026-01-20'), fechaLimite: new Date('2026-02-15'),
        prioridad: 3, seccionId: appRecetas.proyectoId,
      },
    }),
    prisma.tarea.create({
      data: {
        nombreTarea: 'Dashboard de proyectos',
        descripcionTarea: 'Vista principal con resumen de progreso',
        fechaInicio: new Date('2026-02-02'), fechaLimite: new Date('2026-03-01'),
        prioridad: 1, seccionId: doing2.seccionId,
      },
    }),
    prisma.tarea.create({
      data: {
        nombreTarea: 'Drag and drop de tareas',
        descripcionTarea: 'Permitir mover tareas entre secciones arrastrando',
        fechaInicio: new Date('2026-02-05'), fechaLimite: new Date('2026-03-10'),
        prioridad: 2, seccionId: prosperTracker.proyectoId,
      },
    }),
    prisma.tarea.create({
      data: {
        nombreTarea: 'Conexion API notificaciones',
        descripcionTarea: 'Integrar servicio externo de envio de mensajes',
        fechaInicio: new Date('2026-03-02'), fechaLimite: new Date('2026-04-01'),
        prioridad: 1, seccionId: doing3.seccionId,
      },
    }),
  ]);

  // CONTENIDO
  await Promise.all([
    prisma.contenido.create({
      data: {
        descripcionContenido: 'Como usuario quiero iniciar sesion para acceder a mi cuenta de forma segura.',
        tareaId: loginTask.tareaId, tipoContenidoId: descDetallada.tipoContenidoId,
        fechaCreacion: new Date('2026-01-16T10:00:00'),
      },
    }),
    prisma.contenido.create({
      data: {
        descripcionContenido: 'El boton de login debe ir centrado, color azul, con esquinas redondeadas.',
        tareaId: loginTask.tareaId, tipoContenidoId: notaDiseno.tipoContenidoId,
        fechaCreacion: new Date('2026-01-16T11:00:00'),
      },
    }),
    prisma.contenido.create({
      data: {
        descripcionContenido: 'SELECT * FROM usuario WHERE email = $1 AND contrasena = $2;',
        tareaId: loginTask.tareaId, tipoContenidoId: fragmentoCodigo.tipoContenidoId,
        fechaCreacion: new Date('2026-01-17T09:30:00'),
      },
    }),
    prisma.contenido.create({
      data: {
        descripcionContenido: 'Se decidio usar JWT en vez de sesiones en servidor para mantener el sistema sin estado.',
        tareaId: loginTask.tareaId, tipoContenidoId: decisionTecnica.tipoContenidoId,
        fechaCreacion: new Date('2026-01-17T15:00:00'),
      },
    }),
    prisma.contenido.create({
      data: {
        descripcionContenido: 'Las recetas deben mostrarse en tarjetas ordenadas por fecha de creacion.',
        tareaId: recetasTask.tareaId, tipoContenidoId: descDetallada.tipoContenidoId,
        fechaCreacion: new Date('2026-01-19T08:00:00'),
      },
    }),
  ]);

  // SUBTAREAS
  await Promise.all([
    prisma.subtarea.create({ data: { descripcionSubtarea: 'Crear formulario de login', estadoSubtarea: true,  fechaCreacion: new Date('2026-01-16T09:00:00'), tareaId: loginTask.tareaId } }),
    prisma.subtarea.create({ data: { descripcionSubtarea: 'Validar formato de email',  estadoSubtarea: true,  fechaCreacion: new Date('2026-01-16T09:05:00'), tareaId: loginTask.tareaId } }),
    prisma.subtarea.create({ data: { descripcionSubtarea: 'Conectar con base de datos',estadoSubtarea: false, fechaCreacion: new Date('2026-01-16T09:10:00'), tareaId: loginTask.tareaId } }),
    prisma.subtarea.create({ data: { descripcionSubtarea: 'Manejar mensajes de error', estadoSubtarea: false, fechaCreacion: new Date('2026-01-16T09:15:00'), tareaId: loginTask.tareaId } }),
    prisma.subtarea.create({ data: { descripcionSubtarea: 'Disenar tarjeta de receta', estadoSubtarea: true,  fechaCreacion: new Date('2026-01-18T10:00:00'), tareaId: recetasTask.tareaId } }),
    prisma.subtarea.create({ data: { descripcionSubtarea: 'Implementar paginacion',    estadoSubtarea: false, fechaCreacion: new Date('2026-01-18T10:05:00'), tareaId: recetasTask.tareaId } }),
  ]);

  console.log('Seed completado exitosamente.');
  console.log('Usuarios disponibles:');
  console.log('  juan.perez@email.com   / juanperez');
  console.log('  maria.gomez@email.com  / mariagomez');
  console.log('  pedro.ramirez@email.com / pedroramirez');
  console.log('  laura.castro@email.com / lauracastro');
  console.log('  andres.lopez@email.com / andreslopez (inactivo)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
