import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtareaDto } from './dto/create-subtarea.dto';
import { UpdateSubtareaDto } from './dto/update-subtarea.dto';

@Injectable()
export class SubtareaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubtareaDto, usuarioId: number) {
    await this.verificarAccesoTarea(dto.tareaId, usuarioId);

    return this.prisma.subtarea.create({
      data: {
        descripcionSubtarea: dto.descripcionSubtarea,
        tareaId: dto.tareaId,
      },
      select: this.camposSubtarea(),
    });
  }

  async findAllByTarea(tareaId: number, usuarioId: number) {
    await this.verificarAccesoTarea(tareaId, usuarioId);

    return this.prisma.subtarea.findMany({
      where: { tareaId },
      select: this.camposSubtarea(),
      orderBy: { fechaCreacion: 'asc' },
    });
  }

  async update(subtareaId: number, dto: UpdateSubtareaDto, usuarioId: number) {
    const subtarea = await this.obtenerSubtarea(subtareaId);
    await this.verificarAccesoTarea(subtarea.tareaId!, usuarioId);

    return this.prisma.subtarea.update({
      where: { subtareaId },
      data: { ...dto, fechaActualizacion: new Date() },
      select: this.camposSubtarea(),
    });
  }

  async toggleEstado(subtareaId: number, usuarioId: number) {
    const subtarea = await this.obtenerSubtarea(subtareaId);
    await this.verificarAccesoTarea(subtarea.tareaId!, usuarioId);

    return this.prisma.subtarea.update({
      where: { subtareaId },
      data: {
        estadoSubtarea: !subtarea.estadoSubtarea,
        fechaActualizacion: new Date(),
      },
      select: this.camposSubtarea(),
    });
  }

  async remove(subtareaId: number, usuarioId: number) {
    const subtarea = await this.obtenerSubtarea(subtareaId);
    await this.verificarAccesoTarea(subtarea.tareaId!, usuarioId);

    return this.prisma.subtarea.delete({ where: { subtareaId } });
  }

  private async obtenerSubtarea(subtareaId: number) {
    const subtarea = await this.prisma.subtarea.findUnique({
      where: { subtareaId },
    });
    if (!subtarea) throw new NotFoundException('Subtarea no encontrada');
    return subtarea;
  }

  private async verificarAccesoTarea(tareaId: number, usuarioId: number) {
    const tarea = await this.prisma.tarea.findUnique({
      where: { tareaId },
      select: {
        activoTarea: true,
        seccion: {
          select: {
            activoSeccion: true,
            proyecto: {
              select: {
                estadoProyecto: true,
                usuarioCreadorId: true,
                miembros: { select: { usuarioColaboradorId: true } },
              },
            },
          },
        },
      },
    });

    if (!tarea || !tarea.activoTarea || !tarea.seccion?.activoSeccion || !tarea.seccion.proyecto.estadoProyecto) {
      throw new NotFoundException('Tarea no encontrada');
    }

    const { proyecto } = tarea.seccion;
    const esCreador = proyecto.usuarioCreadorId === usuarioId;
    const esMiembro = proyecto.miembros.some(
      (m) => m.usuarioColaboradorId === usuarioId,
    );

    if (!esCreador && !esMiembro) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }
  }

  private camposSubtarea() {
    return {
      subtareaId: true,
      descripcionSubtarea: true,
      estadoSubtarea: true,
      fechaCreacion: true,
      fechaActualizacion: true,
      tareaId: true,
    };
  }
}
