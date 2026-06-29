import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Injectable()
export class TareaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTareaDto, usuarioId: number) {
    await this.verificarAccesoSeccion(dto.seccionId, usuarioId);

    return this.prisma.tarea.create({
      data: {
        nombreTarea: dto.nombreTarea,
        descripcionTarea: dto.descripcionTarea,
        fechaInicio: new Date(dto.fechaInicio),
        fechaLimite: new Date(dto.fechaLimite),
        prioridad: dto.prioridad,
        seccionId: dto.seccionId,
      },
      select: this.camposTarea(),
    });
  }

  async findAll(seccionId: number, usuarioId: number) {
    await this.verificarAccesoSeccion(seccionId, usuarioId);

    return this.prisma.tarea.findMany({
      where: { seccionId, activoTarea: true },
      select: this.camposTarea(),
      orderBy: [{ prioridad: 'desc' }, { fechaLimite: 'asc' }],
    });
  }

  async findOne(tareaId: number, usuarioId: number) {
    const tarea = await this.prisma.tarea.findUnique({
      where: { tareaId },
      select: {
        ...this.camposTarea(),
        subtareas: {
          select: {
            subtareaId: true,
            descripcionSubtarea: true,
            estadoSubtarea: true,
            fechaCreacion: true,
          },
        },
        contenidos: {
          select: {
            contenidoId: true,
            descripcionContenido: true,
            estadoContenido: true,
            fechaCreacion: true,
            tipoContenido: { select: { tipoContenidoId: true, nombreTipoContenido: true } },
          },
        },
      },
    });

    if (!tarea || !tarea.activoTarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (tarea.seccionId) {
      await this.verificarAccesoSeccion(tarea.seccionId, usuarioId);
    }

    return tarea;
  }

  async update(tareaId: number, dto: UpdateTareaDto, usuarioId: number) {
    const tarea = await this.obtenerTarea(tareaId);
    if (tarea.seccionId) await this.verificarAccesoSeccion(tarea.seccionId, usuarioId);

    return this.prisma.tarea.update({
      where: { tareaId },
      data: {
        ...dto,
        ...(dto.fechaInicio && { fechaInicio: new Date(dto.fechaInicio) }),
        ...(dto.fechaLimite && { fechaLimite: new Date(dto.fechaLimite) }),
      },
      select: this.camposTarea(),
    });
  }

  async mover(tareaId: number, seccionDestinoId: number, usuarioId: number) {
    const tarea = await this.obtenerTarea(tareaId);
    if (tarea.seccionId) await this.verificarAccesoSeccion(tarea.seccionId, usuarioId);
    await this.verificarAccesoSeccion(seccionDestinoId, usuarioId);

    return this.prisma.tarea.update({
      where: { tareaId },
      data: { seccionId: seccionDestinoId },
      select: this.camposTarea(),
    });
  }

  async remove(tareaId: number, usuarioId: number) {
    const tarea = await this.obtenerTarea(tareaId);
    if (tarea.seccionId) await this.verificarAccesoSeccion(tarea.seccionId, usuarioId);

    return this.prisma.tarea.update({
      where: { tareaId },
      data: { activoTarea: false, fechaDesactivado: new Date() },
      select: this.camposTarea(),
    });
  }

  private async obtenerTarea(tareaId: number) {
    const tarea = await this.prisma.tarea.findUnique({ where: { tareaId } });
    if (!tarea || !tarea.activoTarea) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return tarea;
  }

  private async verificarAccesoSeccion(seccionId: number, usuarioId: number) {
    const seccion = await this.prisma.seccion.findUnique({
      where: { seccionId },
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
    });

    if (!seccion || !seccion.activoSeccion || !seccion.proyecto.estadoProyecto) {
      throw new NotFoundException('Sección no encontrada');
    }

    const { proyecto } = seccion;
    const esCreador = proyecto.usuarioCreadorId === usuarioId;
    const esMiembro = proyecto.miembros.some(
      (m) => m.usuarioColaboradorId === usuarioId,
    );

    if (!esCreador && !esMiembro) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }
  }

  private camposTarea() {
    return {
      tareaId: true,
      nombreTarea: true,
      descripcionTarea: true,
      fechaInicio: true,
      fechaLimite: true,
      prioridad: true,
      activoTarea: true,
      seccionId: true,
    };
  }
}
