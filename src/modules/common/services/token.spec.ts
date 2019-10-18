import { BadRequestException } from '@nestjs/common';
import { enRoles, IUser } from 'interfaces/models/user';

import { enTokenType, TokenService } from './token';

describe('Admin/TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    service = new TokenService();
  });

  const user: IUser = {
    id: 1,
    email: 'test@email.com',
    firstName: 'test',
    lastName: 'test',
    roles: [enRoles.admin]
  };

  it('should generate an accessToken for web', async () => {
    return service
      .generateAccessToken(user, false)
      .then(token => {
        expect(typeof token).toBe('string');
        return service.verify(token, enTokenType.accessToken);
      })
      .then(result => {
        expect(result.id).toEqual(user.id);
        expect(result.firstName).toEqual(user.firstName);
        expect(result.lastName).toEqual(user.lastName);
        expect(result.email).toEqual(user.email);
        expect(result.roles).toEqual(user.roles);
      });
  });

  it('should generate an accessToken for app', async () => {
    return service
      .generateAccessToken(user, true)
      .then(token => {
        expect(typeof token).toBe('string');
        return service.verify(token, enTokenType.accessToken);
      })
      .then(result => {
        expect(result.id).toEqual(user.id);
        expect(result.firstName).toEqual(user.firstName);
        expect(result.lastName).toEqual(user.lastName);
        expect(result.email).toEqual(user.email);
        expect(result.roles).toEqual(user.roles);
      });
  });

  it('should verify method reject when send an invalid accessToken', () => {
    return service
      .verify('invalid', enTokenType.accessToken)
      .then(() => fail())
      .catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message.message).toEqual('token-invalid');
      });
  });

  it('should verify method reject when type is different', () => {
    return service
      .generateAccessToken(user)
      .then(token => {
        expect(token).toBeString();
        return service.verify(token, enTokenType.refreshToken);
      })
      .then(() => fail())
      .catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message.message).toEqual('token-type-not-match');
      });
  });

  it('should verify method reject when token is expired', () => {
    return service
      .generateAccessToken(user, false, -30)
      .then(token => {
        expect(token).toBeString();
        return service.verify(token, enTokenType.accessToken);
      })
      .then(() => fail())
      .catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message.message).toEqual('token-expired');
      });
  });

  it('should generate refresh token', () => {
    return service.generateRefreshToken(1, '1').then(token => {
      expect(token).toBeString();
      return expect(service.verify(token, enTokenType.refreshToken)).toResolve();
    });
  });

  it('should renew access token', () => {
    return service
      .renewAccessToken({
        id: 1,
        firstName: 'Daniel',
        lastName: 'Prado',
        email: 'danielprado.ad@gmail.com',
        roles: [enRoles.sysAdmin]
      })
      .then(token => {
        expect(token).toBeString();
        return expect(service.verify(token, enTokenType.accessToken)).toResolve();
      });
  });

  it('should renew access token', () => {
    return service
      .resetPassword({
        id: 1,
        firstName: 'Daniel',
        lastName: 'Prado',
        email: 'danielprado.ad@gmail.com',
        roles: [enRoles.sysAdmin]
      })
      .then(token => {
        expect(token).toBeString();
        return expect(service.verify(token, enTokenType.resetPassword)).toResolve();
      });
  });
});
