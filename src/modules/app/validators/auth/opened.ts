import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OpenedValidator {
  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public deviceId: string;

  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public notificationToken: string;
}
