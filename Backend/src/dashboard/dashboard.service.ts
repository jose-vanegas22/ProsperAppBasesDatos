import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(usuarioId: number) {
    const proyectos = await this.prisma.proyecto.findMany({
      where: {
        estadoProyecto: true,
        OR: [
          { usuarioCreadorId: usuarioId },
          { miembros: { some: { usuarioColaboradorId: usuarioId } } },
        ],
      },
      select: {
        proyectoId: true,
        nombreProyecto: true,
        fechaInicio: true,
        fechaLimite: true,
        usuarioCreadorId: true,
        secciones: {
          where: { activoSeccion: true },
          select: {
            tareas: {
              where: { activoTarea: true },
              select: {
                tareaId: true,
                subtareas: {
                  select: { estadoSubtarea: true },
                },
              },
            },
          },
        },
      },
    });

    const resumenProyectos = proyectos.map((proyecto) => {
      const todasLasTareas = proyecto.secciones.flatMap((s) => s.tareas);
      const totalTareas = todasLasTareas.length;

      const tareasCompletadas = todasLasTareas.filter((tarea) => {
        if (tarea.subtareas.length === 0) return false;
        return tarea.subtareas.every((s) => s.estadoSubtarea);
      }).length;

      const totalSubtareas = todasLasTareas.flatMap((t) => t.subtareas).length;
      const subtareasCompletadas = todasLasTareas
        .flatMap((t) => t.subtareas)
        .filter((s) => s.estadoSubtarea).length;

      const progreso =
        totalSubtareas > 0
          ? Math.round((subtareasCompletadas / totalSubtareas) * 100)
          : 0;

      return {
        proyectoId: proyecto.proyectoId,
        nombreProyecto: proyecto.nombreProyecto,
        fechaInicio: proyecto.fechaInicio,
        fechaLimite: proyecto.fechaLimite,
        rol: proyecto.usuarioCreadorId === usuarioId ? 'creador' : 'colaborador',
        totalTareas,
        tareasCompletadas,
        progreso,
      };
    });

    const totalTareasPendientes = resumenProyectos.reduce(
      (acc, p) => acc + (p.totalTareas - p.tareasCompletadas),
      0,
    );

    return {
      resumen: {
        proyectosActivos: proyectos.length,
        tareasPendientes: totalTareasPendientes,
      },
      proyectos: resumenProyectos,
    };
  }
}
