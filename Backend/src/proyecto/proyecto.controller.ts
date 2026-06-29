import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AddMiembroDto } from './dto/add-miembro.dto';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { ProyectoService } from './proyecto.service';

@ApiBearerAuth()
@ApiTags('Proyectos')
@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear proyecto' })
  create(
    @Body() dto: CreateProyectoDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.proyectoService.create(dto, user.usuarioId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mis proyectos (creados e invitado)' })
  findAll(@CurrentUser() user: { usuarioId: number }) {
    return this.proyectoService.findAll(user.usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver un proyecto' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.proyectoService.findOne(id, user.usuarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar proyecto (solo creador)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProyectoDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.proyectoService.update(id, dto, user.usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar proyecto (solo creador)' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.proyectoService.remove(id, user.usuarioId);
  }

  @Post(':id/miembros')
  @ApiOperation({ summary: 'Invitar miembro al proyecto (solo creador)' })
  addMiembro(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddMiembroDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.proyectoService.addMiembro(id, dto.email, user.usuarioId);
  }

  @Delete(':id/miembros/:miembroId')
  @ApiOperation({ summary: 'Remover miembro del proyecto (solo creador)' })
  removeMiembro(
    @Param('id', ParseIntPipe) id: number,
    @Param('miembroId', ParseIntPipe) miembroId: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.proyectoService.removeMiembro(id, miembroId, user.usuarioId);
  }
}
