import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProyectoDto {
  @ApiProperty({ example: 'App de finanzas' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreProyecto!: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  fechaInicio!: string;

  @ApiPropertyOptional({ example: '2025-06-30' })
  @IsDateString()
  @IsOptional()
  fechaLimite?: string;
}
