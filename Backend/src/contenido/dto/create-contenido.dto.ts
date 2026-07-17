import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateContenidoDto {
  @ApiProperty({ example: 'Como usuario quiero iniciar sesión para acceder a mi cuenta.' })
  @IsString()
  @IsNotEmpty()
  descripcionContenido!: string;

  @ApiProperty({ example: 1, description: 'ID del tipo de contenido' })
  @IsInt()
  @IsPositive()
  tipoContenidoId!: number;

  @ApiProperty({ example: 1, description: 'ID de la tarea' })
  @IsInt()
  @IsPositive()
  tareaId!: number;
}
