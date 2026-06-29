import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Permite crear un usuario, asegurándose de que el email no esté duplicado y cifrando la contraseña antes de guardarla en la base de datos.
  async create(dto: CreateUserDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (existe) throw new ConflictException('El email ya está registrado');

    const hash = await bcrypt.hash(dto.contrasena, 10);

    return this.prisma.usuario.create({
      data: {
        ...dto,
        contrasena: hash,
        fechaNacimiento: new Date(dto.fechaNacimiento),
      },
      select: this.camposPublicos(),
    });
  }

  // Permite obtener todos los usuarios activos de la base de datos, devolviendo solo los campos públicos definidos en el método camposPublicos.
  findAll() {
    return this.prisma.usuario.findMany({
      where: { activo: true },
      select: this.camposPublicos(),
    });
  }

  // Permite obtener un usuario específico por su ID, devolviendo solo los campos públicos definidos en el método camposPublicos. Si el usuario no existe, lanza una excepción NotFoundException.
  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { usuarioId: id },
      select: this.camposPublicos(),
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  // Permite actualizar un usuario existente, asegurándose de que el email no esté duplicado y actualizando los campos proporcionados en el DTO. Si el usuario no existe, lanza una excepción NotFoundException.
  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.email) {
      const existe = await this.prisma.usuario.findFirst({
        where: { email: dto.email, NOT: { usuarioId: id } },
      });
      if (existe) throw new ConflictException('El email ya está en uso');
    }

    return this.prisma.usuario.update({
      where: { usuarioId: id },
      data: {
        ...dto,
        ...(dto.fechaNacimiento && {
          fechaNacimiento: new Date(dto.fechaNacimiento),
        }),
      },
      select: this.camposPublicos(),
    });
  }

  // Permite eliminar un usuario de manera lógica, marcándolo como inactivo y registrando la fecha de desactivación. Si el usuario no existe, lanza una excepción NotFoundException.
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.update({
      where: { usuarioId: id },
      data: { activo: false, fechaDesactivado: new Date() },
      select: this.camposPublicos(),
    });
  }

  private camposPublicos() {
    return {
      usuarioId: true,
      primerNombre: true,
      segundoNombre: true,
      primerApellido: true,
      segundoApellido: true,
      email: true,
      activo: true,
      fechaNacimiento: true,
      fechaCreacion: true,
      fechaDesactivado: true,
    };
  }
}
