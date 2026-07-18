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
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
import { SeccionService } from './seccion.service';

@ApiBearerAuth()
@ApiTags('Secciones')
@Controller('proyectos/:proyectoId/secciones')
export class SeccionController {
  constructor(private readonly seccionService: SeccionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear sección (máx 6 por proyecto)' })
  create(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Body() dto: CreateSeccionDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.seccionService.create(proyectoId, dto, user.usuarioId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar secciones del proyecto' })
  findAll(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.seccionService.findAll(proyectoId, user.usuarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar sección' })
  update(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSeccionDto,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.seccionService.update(proyectoId, id, dto, user.usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar sección (mín 1 por proyecto)' })
  remove(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { usuarioId: number },
  ) {
    return this.seccionService.remove(proyectoId, id, user.usuarioId);
  }
}
