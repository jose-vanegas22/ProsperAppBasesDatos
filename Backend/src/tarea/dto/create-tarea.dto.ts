import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTareaDto {
  @ApiProperty({ example: 'Implementar login' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreTarea!: string;

  @ApiProperty({ example: 'Permitir inicio de sesión con email y contraseña' })
  @IsString()
  @IsNotEmpty()
  descripcionTarea!: string;

  @ApiProperty({ example: '2026-01-16' })
  @IsDateString()
  fechaInicio!: string;

  @ApiProperty({ example: '2026-02-01' })
  @IsDateString()
  fechaLimite!: string;

  @ApiProperty({ example: 2, description: '1 = Baja, 2 = Media, 3 = Alta' })
  @IsInt()
  @Min(1)
  @Max(3)
  prioridad!: number;

  @ApiProperty({ example: 1, description: 'ID de la sección' })
  @IsInt()
  seccionId!: number;
}
