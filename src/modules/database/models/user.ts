import { ApiModelProperty } from '@nestjs/swagger';
import { enRoles, IUser } from 'interfaces/models/user';
import { Model } from 'objection';

import { UserDevice } from './userDevice';
import { UserSocial } from './userSocial';

export class User extends Model implements IUser {
  @ApiModelProperty({ type: 'integer' })
  public id: number;
  @ApiModelProperty({ type: 'string' })
  public firstName: string;
  @ApiModelProperty({ type: 'string' })
  public lastName: string;
  @ApiModelProperty({ type: 'string' })
  public email: string;
  public password: string;
  @ApiModelProperty({ type: ['string'] })
  public roles: enRoles[];

  @ApiModelProperty({ type: 'string', format: 'date-time' })
  public createdDate: Date;
  @ApiModelProperty({ type: 'string', format: 'date-time' })
  public updatedDate: Date;

  // @ApiModelProperty({ nullable: true, type: [UserDevice] })
  public devices?: UserDevice[];
  // @ApiModelProperty({ nullable: true, type: [UserSocial] })
  public socials?: UserSocial[];

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  public static get tableName(): string {
    return 'User';
  }

  public static get relationMappings(): any {
    return {
      devices: {
        relation: Model.HasManyRelation,
        modelClass: UserDevice,
        join: {
          from: 'User.id',
          to: 'UserDevice.userId'
        }
      },

      socials: {
        relation: Model.HasManyRelation,
        modelClass: UserSocial,
        join: {
          from: 'User.id',
          to: 'UserSocial.userId'
        }
      }
    };
  }

  public static get virtualAttributes(): string[] {
    return ['fullName'];
  }

  public isSysAdmin(): boolean {
    return this.roles.includes(enRoles.sysAdmin);
  }

  public $beforeInsert(): void {
    this.createdDate = this.updatedDate = new Date();
  }

  public $beforeUpdate(): void {
    this.updatedDate = new Date();
  }

  public $formatDatabaseJson(json: any): any {
    json = Model.prototype.$formatDatabaseJson.call(this, json);
    json.roles = json.roles && json.roles.length ? json.roles.join(',') : null;
    return json;
  }

  public $parseDatabaseJson(json: any): any {
    json.roles = json.roles ? json.roles.split(',') : [];
    json.createdDate = json.createdDate ? new Date(json.createdDate) : null;
    json.updatedDate = json.updatedDate ? new Date(json.updatedDate) : null;
    return Model.prototype.$formatDatabaseJson.call(this, json);
  }

  public $formatJson(data: IUser): IUser {
    delete data.password;
    return data;
  }
}
