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
import { ContenidoService } from './contenido.service';
import { CreateContenidoDto } from './dto/create-contenido.dto';
import { UpdateContenidoDto } from './dto/update-contenido.dto';

@ApiBearerAuth()
@ApiTags('Contenido')
@Controller('contenidos')
export class ContenidoController {
  constructor(private readonly contenidoService: ContenidoService) {}

  @Get('tipos')
  @ApiOperation({ summary: 'Listar tipos de contenido disponibles' })
  findTipos() {
    return this.contenidoService.findTiposContenido();
  }

  @Post()
  @ApiOperation({ summary: 'Agregar contenido a una tarea' })
  create(
    @Body() dto: CreateContenidoDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.contenidoService.create(dto, user.usuarioId);
  }

  @Get('tarea/:tareaId')
  @ApiOperation({ summary: 'Listar contenidos de una tarea' })
  findAll(
    @Param('tareaId', ParseIntPipe) tareaId: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.contenidoService.findAllByTarea(tareaId, user.usuarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar contenido' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContenidoDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.contenidoService.update(id, dto, user.usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar contenido' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.contenidoService.remove(id, user.usuarioId);
  }
}
