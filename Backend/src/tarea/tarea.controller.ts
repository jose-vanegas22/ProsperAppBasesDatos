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
import { CreateTareaDto } from './dto/create-tarea.dto';
import { MoverTareaDto } from './dto/mover-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { TareaService } from './tarea.service';

@ApiBearerAuth()
@ApiTags('Tareas')
@Controller('tareas')
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear tarea en una sección' })
  create(
    @Body() dto: CreateTareaDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.tareaService.create(dto, user.usuarioId);
  }

  @Get('seccion/:seccionId')
  @ApiOperation({ summary: 'Listar tareas de una sección (ordenadas por prioridad)' })
  findAll(
    @Param('seccionId', ParseIntPipe) seccionId: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.tareaService.findAll(seccionId, user.usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver tarea con subtareas y contenidos' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.tareaService.findOne(id, user.usuarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tarea' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTareaDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.tareaService.update(id, dto, user.usuarioId);
  }

  @Patch(':id/mover')
  @ApiOperation({ summary: 'Mover tarea a otra sección' })
  mover(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MoverTareaDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.tareaService.mover(id, dto.seccionId, user.usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar tarea' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.tareaService.remove(id, user.usuarioId);
  }
}
