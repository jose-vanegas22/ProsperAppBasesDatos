import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class MoverTareaDto {
  @ApiProperty({ example: 3, description: 'ID de la sección destino' })
  @IsInt()
  @IsPositive()
  seccionId!: number;
}
