import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';

const MAX_SECCIONES = 6;
const MIN_SECCIONES = 1;

@Injectable()
export class SeccionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(proyectoId: number, dto: CreateSeccionDto, usuarioId: number) {
    await this.verificarAccesoProyecto(proyectoId, usuarioId);

    const total = await this.prisma.seccion.count({
      where: { proyectoId, activoSeccion: true },
    });

    if (total >= MAX_SECCIONES) {
      throw new BadRequestException(
        `Un proyecto no puede tener más de ${MAX_SECCIONES} secciones`,
      );
    }

    return this.prisma.seccion.create({
      data: { ...dto, proyectoId },
      select: this.camposSeccion(),
    });
  }

  async findAll(proyectoId: number, usuarioId: number) {
    await this.verificarAccesoProyecto(proyectoId, usuarioId);

    return this.prisma.seccion.findMany({
      where: { proyectoId, activoSeccion: true },
      select: this.camposSeccion(),
      orderBy: { fechaCreacion: 'asc' },
    });
  }

  async update(
    proyectoId: number,
    seccionId: number,
    dto: UpdateSeccionDto,
    usuarioId: number,
  ) {
    await this.verificarAccesoProyecto(proyectoId, usuarioId);
    await this.obtenerSeccion(seccionId, proyectoId);

    return this.prisma.seccion.update({
      where: { seccionId },
      data: { ...dto, fechaActualizacion: new Date() },
      select: this.camposSeccion(),
    });
  }

  async remove(proyectoId: number, seccionId: number, usuarioId: number) {
    await this.verificarAccesoProyecto(proyectoId, usuarioId);
    await this.obtenerSeccion(seccionId, proyectoId);

    const total = await this.prisma.seccion.count({
      where: { proyectoId, activoSeccion: true },
    });

    if (total <= MIN_SECCIONES) {
      throw new BadRequestException(
        `Un proyecto debe tener al menos ${MIN_SECCIONES} sección`,
      );
    }

    return this.prisma.seccion.update({
      where: { seccionId },
      data: { activoSeccion: false, fechaDesactivado: new Date() },
      select: this.camposSeccion(),
    });
  }

  private async obtenerSeccion(seccionId: number, proyectoId: number) {
    const seccion = await this.prisma.seccion.findUnique({
      where: { seccionId },
    });

    if (!seccion || !seccion.activoSeccion || seccion.proyectoId !== proyectoId) {
      throw new NotFoundException('Sección no encontrada');
    }

    return seccion;
  }

  private async verificarAccesoProyecto(proyectoId: number, usuarioId: number) {
    const proyecto = await this.prisma.proyecto.findUnique({
      where: { proyectoId },
      include: { miembros: { select: { usuarioColaboradorId: true } } },
    });

    if (!proyecto || !proyecto.estadoProyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    const esCreador = proyecto.usuarioCreadorId === usuarioId;
    const esMiembro = proyecto.miembros.some(
      (m) => m.usuarioColaboradorId === usuarioId,
    );

    if (!esCreador && !esMiembro) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }
  }

  private camposSeccion() {
    return {
      seccionId: true,
      nombreSeccion: true,
      color: true,
      activoSeccion: true,
      fechaCreacion: true,
      fechaActualizacion: true,
      proyectoId: true,
    };
  }
}
