import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshValidator {
  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public refreshToken: string;

  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public deviceId: string;
}
