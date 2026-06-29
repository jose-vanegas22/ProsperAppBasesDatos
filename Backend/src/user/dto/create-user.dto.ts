import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  primerNombre!: string;

  @ApiPropertyOptional({ example: 'Carlos' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  segundoNombre?: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  primerApellido!: string;

  @ApiPropertyOptional({ example: 'García' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  segundoApellido?: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  @MaxLength(50)
  email!: string;

  @ApiProperty({ example: 'miContrasena123' })
  @IsString()
  @MinLength(6)
  contrasena!: string;

  @ApiProperty({ example: '1995-08-15' })
  @IsDateString()
  fechaNacimiento!: string;
}
