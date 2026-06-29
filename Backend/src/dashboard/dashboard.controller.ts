import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Resumen general: proyectos activos, tareas pendientes y progreso' })
  getDashboard(@CurrentUser() user: { usuarioId: number }) {
    return this.dashboardService.getDashboard(user.usuarioId);
  }
}
