import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';
import { enRoles, IUser, listPublicRoles } from 'interfaces/models/user';

export class SaveValidator implements IUser {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiModelProperty({ required: false, type: 'integer' })
  public id?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiModelProperty({ required: true, type: 'string', minLength: 3, maxLength: 50 })
  public firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiModelProperty({ required: false, type: 'string', maxLength: 50 })
  public lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  @ApiModelProperty({ required: true, type: 'string', maxLength: 150 })
  public email: string;

  @IsNotEmpty()
  @IsArray()
  @IsIn(listPublicRoles(), { each: true })
  @ApiModelProperty({ required: true, enum: listPublicRoles(), isArray: true })
  public roles: enRoles[];
}
