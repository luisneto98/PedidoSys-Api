import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { IRequest } from './../../../database/interfaces/request';

export class SaveValidator implements IRequest {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, type: 'integer' })
  public id?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false, type: 'integer' })
  public requesterId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @ApiProperty({ required: true, type: 'string', maxLength: 250 })
  public description: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false, type: 'integer' })
  public quantity?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true, type: 'float' })
  public value: number;
}
