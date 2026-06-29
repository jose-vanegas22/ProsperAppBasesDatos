import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class UpdateContenidoDto {
  @ApiPropertyOptional({ example: 'Descripción actualizada del contenido.' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  descripcionContenido?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  tipoContenidoId?: number;
}
