import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';

import * as service from './token';
import { enTokenType } from './token';
import { IUser, enRoles } from 'interfaces/models/user';
import { IUserToken } from 'interfaces/tokens/user';
import { IResetPasswordToken } from 'interfaces/tokens/resetPassword';

use(chaiAsPromise);

describe('services/token', () => {
  const user: IUser = {
    id: 1,
    email: 'test@email.com',
    firstName: 'test',
    lastName: 'test',
    roles: [enRoles.admin]
  };

  it('should generate a userToken', () => {
    return expect(service.userToken(user)).to.eventually.be.fulfilled.then((token: string) => {
      expect(token).to.be.a('string');
      return expect(service.verify(token, enTokenType.userToken)).to.eventually.be.fulfilled as any;
    }).then((userToken: IUserToken) => {
      expect(userToken).to.contain.all.keys(user);
      expect(userToken.roles).to.be.an('array');
      expect(userToken.roles).to.be.lengthOf(1);
      expect(userToken.roles[0]).to.be.equal(enRoles.admin);
    });
  });

  it('should verify method reject when send an invalid userToken', () => {
    return expect(service.verify('invalid', enTokenType.userToken)).to.be.rejected;
  });

  it('should verify method reject when type is different', () => {
    return expect(service.userToken(user)).to.eventually.be.fulfilled.then((token: string) => {
      expect(token).to.be.a('string');
      return expect(service.verify(token, enTokenType.resetPassword)).to.eventually.be.rejected;
    });
  });

  it('should generate a resetPassword token', () => {
    return expect(service.resetPassword(user)).to.eventually.be.fulfilled.then((token: string) => {
      expect(token).to.be.a('string');
      return expect(service.verify(token, enTokenType.resetPassword)).to.eventually.be.fulfilled as any;
    }).then((token: IResetPasswordToken) => {
      expect(token.id).to.be.equal(user.id);
    });
  });

});