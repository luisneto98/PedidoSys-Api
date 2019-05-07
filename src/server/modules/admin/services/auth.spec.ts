import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import { enRoles } from 'interfaces/models/user';
import * as _ from 'lodash';
import { User } from 'models/user';
import * as tokenService from 'services/token';

import * as service from './auth';

use(chaiAsPromise);

describe('admin/services/auth', () => {
  const data = {
    email: 'admin@waproject.com.br',
    password: 'senha@123'
  };

  const userToken = {
    id: 1,
    email: 'test@email.com',
    firstName: 'test',
    lastName: 'test',
    roles: [] as enRoles[]
  };

  it('should return token for a valid user when try to login', () => {
    return expect(service.login(data.email, data.password)).to.be.eventually.fulfilled.then((token: string) => {
      expect(token).to.be.a('string');
    });
  });

  it('should throw user-not-found when email is invalid when try to login', () => {
    return expect(service.login('nothing@email.com', data.password)).to.be.eventually.rejected.then((error: Error) => {
      expect(error.message).to.be.equal('user-not-found');
    });
  });

  it('should throw invalid-password when password is invalid when try to login', () => {
    return expect(service.login(data.email, '123')).to.be.rejected.then((error: Error) => {
      expect(error.message).to.be.equal('invalid-password');
    });
  });

  it('should throw invalid-password when password is invalid when try to change password', () => {
    return expect(service.changePassword(userToken, '123', '456')).to.be.eventually.rejected.then((error: Error) => {
      expect(error.message).to.be.equal('invalid-password');
    });
  });

  it('should return successfully when try to change password', () => {
    return expect(service.changePassword(userToken, data.password, '123456')).to.be.eventually.fulfilled
      .then((user: User) => {
        return expect(user.checkPassword('123456')).to.be.fulfilled as any;
      });
  });

  it('should return successfully when try to send reset password email', () => {
    return expect(service.sendResetPassword(data.email)).to.be.eventually.fulfilled as any;
  });

  it('should throw user-not-found when when try to send reset password email and email is invalid', () => {
    return expect(service.sendResetPassword('invalid')).to.be.eventually.rejected.then((error: Error) => {
      expect(error.message).to.be.equal('user-not-found');
    });
  });

  it('should return successfully when try to reset password', () => {
    const newPassword = 'senha@123';
    return expect(tokenService.resetPassword(userToken)).to.be.fulfilled.then((token: string) => {
      expect(token).to.be.a('string');
      return expect(service.resetPassword(token, newPassword)).to.be.eventually.fulfilled as any;
    }).then((user: any) => {
      expect(user).to.be.an.instanceOf(User);
      expect(user.checkPassword(newPassword)).to.be.fulfilled as any;
    });
  });

  it('should throw user-not-found when try to reset password and userId is invalid', () => {
    const newPassword = 'senha@123';
    const model = _.cloneDeep(userToken);
    model.id = 0;

    return expect(tokenService.resetPassword(model)).to.be.fulfilled.then((token: any) => {
      expect(token).to.be.a('string');
      return expect(service.resetPassword(token, newPassword)).to.be.eventually.rejected;
    }).then((error: any) => {
      expect(error.message).to.be.equal('user-not-found');
    });
  });

  it('should throw token-type-not-match when try to reset password and token is invalid', () => {
    const newPassword = 'senha@123';
    return expect(tokenService.userToken(userToken)).to.be.fulfilled.then((token: string) => {
      expect(token).to.be.a('string');
      return expect(service.resetPassword(token, newPassword)).to.be.eventually.rejected;
    }).then((error: any) => {
      expect(error.message).to.be.equal('token-type-not-match');
    });
  });

  it('should throw token-invalid when try to reset password and token is invalid', () => {
    const newPassword = 'senha@123';
    return expect(service.resetPassword('token', newPassword)).to.be.eventually.rejected.then((error: Error) => {
      expect(error.message).to.be.equal('token-invalid');
    });
  });

});