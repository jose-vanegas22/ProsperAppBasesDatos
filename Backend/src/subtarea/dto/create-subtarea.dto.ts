import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateSubtareaDto {
  @ApiProperty({ example: 'Crear formulario de login' })
  @IsString()
  @IsNotEmpty()
  descripcionSubtarea!: string;

  @ApiProperty({ example: 1, description: 'ID de la tarea' })
  @IsInt()
  @IsPositive()
  tareaId!: number;
}
