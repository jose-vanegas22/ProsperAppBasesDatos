import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { SeccionModule } from './seccion/seccion.module';
import { TareaModule } from './tarea/tarea.module';
import { UserModule } from './user/user.module';
import { ContenidoModule } from './contenido/contenido.module';
import { SubtareaModule } from './subtarea/subtarea.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ProyectoModule, SeccionModule, TareaModule, ContenidoModule, SubtareaModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
