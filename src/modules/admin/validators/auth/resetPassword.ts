import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordValidator {
  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public token: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @ApiModelProperty({ required: true, minLength: 5, maxLength: 20 })
  public password: string;
}
