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
import { CreateSubtareaDto } from './dto/create-subtarea.dto';
import { UpdateSubtareaDto } from './dto/update-subtarea.dto';
import { SubtareaService } from './subtarea.service';

@ApiBearerAuth()
@ApiTags('Subtareas')
@Controller('subtareas')
export class SubtareaController {
  constructor(private readonly subtareaService: SubtareaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear subtarea en una tarea' })
  create(
    @Body() dto: CreateSubtareaDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.subtareaService.create(dto, user.usuarioId);
  }

  @Get('tarea/:tareaId')
  @ApiOperation({ summary: 'Listar subtareas de una tarea' })
  findAll(
    @Param('tareaId', ParseIntPipe) tareaId: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.subtareaService.findAllByTarea(tareaId, user.usuarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar descripción de subtarea' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubtareaDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.subtareaService.update(id, dto, user.usuarioId);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Marcar/desmarcar subtarea como completada' })
  toggleEstado(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.subtareaService.toggleEstado(id, user.usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar subtarea' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.subtareaService.remove(id, user.usuarioId);
  }
}
