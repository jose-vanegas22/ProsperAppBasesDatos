import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSubtareaDto {
  @ApiPropertyOptional({ example: 'Crear formulario de login con validación' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  descripcionSubtarea?: string;
}
