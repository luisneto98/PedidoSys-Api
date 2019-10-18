import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendResetValidator {
  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public email: string;
}
