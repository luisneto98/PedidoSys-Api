import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginValidator {
  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public email: string;

  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public password: string;

  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public deviceId: string;

  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public deviceName: string;

  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  public notificationToken: string;
}
