import { ApiModelProperty } from '@nestjs/swagger';
import { IDevice } from 'interfaces/models/device';
import { Model } from 'objection';

import { User } from './user';

export class Device extends Model implements IDevice {
  @ApiModelProperty({ type: 'string' })
  public id: string;
  @ApiModelProperty({ type: 'integer' })
  public userId?: number;
  @ApiModelProperty({ type: 'string' })
  public name: string;
  @ApiModelProperty({ type: 'string' })
  public currentToken: string;
  @ApiModelProperty({ type: 'string' })
  public notificationToken?: string;
  @ApiModelProperty({ type: 'string', format: 'date-time' })
  public createdDate: Date;
  @ApiModelProperty({ type: 'string', format: 'date-time' })
  public updatedDate: Date;

  public user: User;

  public static get tableName(): string {
    return 'Device';
  }

  public static get relationMappings(): any {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        filter: (query: any) => query.select('id', 'firstName', 'lastName', 'email'),
        join: {
          from: 'User.id',
          to: 'Device.userId'
        }
      }
    };
  }

  public $beforeInsert(): void {
    this.createdDate = this.updatedDate = new Date();
  }

  public $beforeUpdate(): void {
    this.updatedDate = new Date();
  }

  public $formatJson(data: IDevice): IDevice {
    delete data.notificationToken;
    delete data.currentToken;
    return data;
  }
}
