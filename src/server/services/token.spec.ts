import * as service from './token';
import { enTokenType } from './token';
import { IUser, enRoles } from 'interfaces/models/user';
import { IUserToken } from 'interfaces/tokens/user';
import { IResetPasswordToken } from 'interfaces/tokens/resetPassword';

describe('services/token', () => {
  const user: IUser = {
    id: 1,
    email: 'test@email.com',
    firstName: 'test',
    lastName: 'test',
    roles: [enRoles.admin]
  };

  it('should generate a userToken', () => {
    return expect(service.userToken(user)).toResolve().then((token: string) => {
      expect(token).toBeString();
      return expect(service.verify(token, enTokenType.userToken)).toResolve() as any;
    }).then((userToken: IUserToken) => {
      expect(userToken).toContainAllKeys(Object.keys(user));
      expect(userToken.roles).toBeArrayOfSize(1);
      expect(userToken.roles[0]).toEqual(enRoles.admin);
    });
  });

  it('should verify method reject when send an invalid userToken', () => {
    return expect(service.verify('invalid', enTokenType.userToken)).toReject();
  });

  it('should verify method reject when type is different', () => {
    return expect(service.userToken(user)).toResolve().then((token: string) => {
      expect(token).toBeString();
      return expect(service.verify(token, enTokenType.resetPassword)).toReject();
    });
  });

  it('should generate a resetPassword token', () => {
    return expect(service.resetPassword(user)).toResolve().then((token: string) => {
      expect(token).toBeString();
      return expect(service.verify(token, enTokenType.resetPassword)).toResolve() as any;
    }).then((token: IResetPasswordToken) => {
      expect(token.id).toEqual(user.id);
    });
  });

});