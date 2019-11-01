import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordValidator {
  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public currentPassword: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @ApiModelProperty({ required: true, minLength: 5, maxLength: 20 })
  public newPassword: string;
}
