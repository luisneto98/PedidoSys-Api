import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LogoutValidator {
  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public deviceId: string;
}
