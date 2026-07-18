import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContenidoDto } from './dto/create-contenido.dto';
import { UpdateContenidoDto } from './dto/update-contenido.dto';

@Injectable()
export class ContenidoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContenidoDto, usuarioId: number) {
    await this.verificarAccesoTarea(dto.tareaId, usuarioId);
    await this.verificarTipoContenido(dto.tipoContenidoId);

    return this.prisma.contenido.create({
      data: {
        descripcionContenido: dto.descripcionContenido,
        tareaId: dto.tareaId,
        tipoContenidoId: dto.tipoContenidoId,
      },
      select: this.camposContenido(),
    });
  }

  async findAllByTarea(tareaId: number, usuarioId: number) {
    await this.verificarAccesoTarea(tareaId, usuarioId);

    return this.prisma.contenido.findMany({
      where: { tareaId, estadoContenido: true },
      select: this.camposContenido(),
      orderBy: { fechaCreacion: 'asc' },
    });
  }

  async update(contenidoId: number, dto: UpdateContenidoDto, usuarioId: number) {
    const contenido = await this.obtenerContenido(contenidoId);
    await this.verificarAccesoTarea(contenido.tareaId, usuarioId);

    if (dto.tipoContenidoId) {
      await this.verificarTipoContenido(dto.tipoContenidoId);
    }

    return this.prisma.contenido.update({
      where: { contenidoId },
      data: { ...dto, fechaActualizacion: new Date() },
      select: this.camposContenido(),
    });
  }

  async remove(contenidoId: number, usuarioId: number) {
    const contenido = await this.obtenerContenido(contenidoId);
    await this.verificarAccesoTarea(contenido.tareaId, usuarioId);

    return this.prisma.contenido.update({
      where: { contenidoId },
      data: { estadoContenido: false, fechaDesactivado: new Date() },
      select: this.camposContenido(),
    });
  }

  findTiposContenido() {
    return this.prisma.tipoContenido.findMany({
      select: { tipoContenidoId: true, nombreTipoContenido: true },
    });
  }

  private async obtenerContenido(contenidoId: number) {
    const contenido = await this.prisma.contenido.findUnique({
      where: { contenidoId },
    });
    if (!contenido || !contenido.estadoContenido) {
      throw new NotFoundException('Contenido no encontrado');
    }
    return contenido;
  }

  private async verificarTipoContenido(tipoContenidoId: number) {
    const tipo = await this.prisma.tipoContenido.findUnique({
      where: { tipoContenidoId },
    });
    if (!tipo) throw new NotFoundException('Tipo de contenido no encontrado');
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

  private camposContenido() {
    return {
      contenidoId: true,
      descripcionContenido: true,
      estadoContenido: true,
      fechaCreacion: true,
      fechaActualizacion: true,
      tareaId: true,
      tipoContenido: {
        select: { tipoContenidoId: true, nombreTipoContenido: true },
      },
    };
  }
}
