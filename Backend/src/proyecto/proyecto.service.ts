import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';

@Injectable()
export class ProyectoService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProyectoDto, usuarioId: number) {
    return this.prisma.proyecto.create({
      data: {
        nombreProyecto: dto.nombreProyecto,
        fechaInicio: new Date(dto.fechaInicio),
        ...(dto.fechaLimite && { fechaLimite: new Date(dto.fechaLimite) }),
        usuarioCreadorId: usuarioId,
      },
      select: this.camposProyecto(),
    });
  }

  findAll(usuarioId: number) {
    return this.prisma.proyecto.findMany({
      where: {
        estadoProyecto: true,
        OR: [
          { usuarioCreadorId: usuarioId },
          { miembros: { some: { usuarioColaboradorId: usuarioId } } },
        ],
      },
      select: this.camposProyecto(),
    });
  }

  async findOne(proyectoId: number, usuarioId: number) {
    const proyecto = await this.prisma.proyecto.findUnique({
      where: { proyectoId },
      select: {
        ...this.camposProyecto(),
        miembros: {
          select: {
            usuarioColaboradorId: true,
            fechaUnion: true,
            usuario: {
              select: {
                usuarioId: true,
                primerNombre: true,
                primerApellido: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!proyecto || !proyecto.estadoProyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    this.verificarAcceso(proyecto, usuarioId);
    return proyecto;
  }

  async update(proyectoId: number, dto: UpdateProyectoDto, usuarioId: number) {
    const proyecto = await this.obtenerProyecto(proyectoId);
    this.verificarCreador(proyecto, usuarioId);

    return this.prisma.proyecto.update({
      where: { proyectoId },
      data: {
        ...dto,
        ...(dto.fechaInicio && { fechaInicio: new Date(dto.fechaInicio) }),
        ...(dto.fechaLimite && { fechaLimite: new Date(dto.fechaLimite) }),
      },
      select: this.camposProyecto(),
    });
  }

  async remove(proyectoId: number, usuarioId: number) {
    const proyecto = await this.obtenerProyecto(proyectoId);
    this.verificarCreador(proyecto, usuarioId);

    return this.prisma.proyecto.update({
      where: { proyectoId },
      data: { estadoProyecto: false },
      select: this.camposProyecto(),
    });
  }

  async addMiembro(proyectoId: number, email: string, usuarioId: number) {
    const proyecto = await this.obtenerProyecto(proyectoId);
    this.verificarCreador(proyecto, usuarioId);

    const miembro = await this.prisma.usuario.findUnique({ where: { email } });
    if (!miembro || !miembro.activo) {
      throw new NotFoundException('No existe un usuario con ese correo');
    }

    if (miembro.usuarioId === usuarioId) {
      throw new ConflictException('El creador ya pertenece al proyecto');
    }

    const yaExiste = await this.prisma.usuarioProyecto.findUnique({
      where: {
        usuarioColaboradorId_proyectoId: {
          usuarioColaboradorId: miembro.usuarioId,
          proyectoId,
        },
      },
    });
    if (yaExiste) throw new ConflictException('El usuario ya es miembro');

    return this.prisma.usuarioProyecto.create({
      data: { usuarioColaboradorId: miembro.usuarioId, proyectoId },
      select: {
        fechaUnion: true,
        usuario: {
          select: {
            usuarioId: true,
            primerNombre: true,
            primerApellido: true,
            email: true,
          },
        },
      },
    });
  }

  async removeMiembro(
    proyectoId: number,
    miembroId: number,
    usuarioId: number,
  ) {
    const proyecto = await this.obtenerProyecto(proyectoId);
    this.verificarCreador(proyecto, usuarioId);

    const existe = await this.prisma.usuarioProyecto.findUnique({
      where: {
        usuarioColaboradorId_proyectoId: {
          usuarioColaboradorId: miembroId,
          proyectoId,
        },
      },
    });
    if (!existe) throw new NotFoundException('El usuario no es miembro');

    return this.prisma.usuarioProyecto.delete({
      where: {
        usuarioColaboradorId_proyectoId: {
          usuarioColaboradorId: miembroId,
          proyectoId,
        },
      },
    });
  }

  private async obtenerProyecto(proyectoId: number) {
    const proyecto = await this.prisma.proyecto.findUnique({
      where: { proyectoId },
    });
    if (!proyecto || !proyecto.estadoProyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return proyecto;
  }

  private verificarCreador(
    proyecto: { usuarioCreadorId: number },
    usuarioId: number,
  ) {
    if (proyecto.usuarioCreadorId !== usuarioId) {
      throw new ForbiddenException('Solo el creador puede realizar esta acción');
    }
  }

  private verificarAcceso(
    proyecto: { usuarioCreadorId: number; miembros?: { usuarioColaboradorId: number }[] },
    usuarioId: number,
  ) {
    const esCreador = proyecto.usuarioCreadorId === usuarioId;
    const esMiembro = proyecto.miembros?.some(
      (m) => m.usuarioColaboradorId === usuarioId,
    );
    if (!esCreador && !esMiembro) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }
  }

  private camposProyecto() {
    return {
      proyectoId: true,
      nombreProyecto: true,
      estadoProyecto: true,
      fechaInicio: true,
      fechaLimite: true,
      usuarioCreadorId: true,
    };
  }
}
