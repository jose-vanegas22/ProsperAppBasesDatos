import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSeccionDto {
  @ApiProperty({ example: 'Backlog' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombreSeccion!: string;

  @ApiProperty({ example: '#9CA3AF' })
  @IsHexColor()
  color!: string;
}
