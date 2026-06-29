import { Module } from '@nestjs/common';
import { SubtareaController } from './subtarea.controller';
import { SubtareaService } from './subtarea.service';

@Module({
  controllers: [SubtareaController],
  providers: [SubtareaService],
})
export class SubtareaModule {}
