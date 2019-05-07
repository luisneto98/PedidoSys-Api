import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';

import { ILoginResult } from './auth';
import * as service from './auth';

use(chaiAsPromise);

describe('app/services/auth', () => {
  const login = {
    email: 'admin@waproject.com.br',
    password: 'senha@123',
    deviceId: '1',
    deviceName: 'test-console'
  };

  it('should return token for a valid user when try to login', () => {
    return expect(service.login(login)).to.be.eventually.fulfilled.then((token: ILoginResult) => {
      expect(token.accessToken).to.be.a('string');
      expect(token.refreshToken).to.be.a('string');
    });
  });

  it('should throw user-not-found when email is invalid when try to login', () => {
    return expect(service.login({ ...login, email: 'nothing@email.com' })).to.be.rejected.then((error: Error) => {
      expect(error.message).to.be.equal('user-not-found');
    });
  });

  it('should throw invalid-password when password is invalid when try to login', () => {
    return expect(service.login({ ...login, password: '123' })).to.be.rejected.then((error: Error) => {
      expect(error.message).to.be.equal('invalid-password');
    });
  });

  it('should update divice and return tokens', () => {
    return expect(service.login(login)).to.be.fulfilled.then((tokens: ILoginResult) => {
      expect(tokens.accessToken).to.be.not.empty;
      expect(tokens.refreshToken).to.be.not.empty;
    });
  });

  it('should generate a new access token', () => {
    return expect(service.login(login)).to.be.fulfilled.then((tokens: ILoginResult) => {
      return expect(service.generateAccessToken(tokens.refreshToken)).to.be.fulfilled as any;
    }).then((accessToken: string) => {
      expect(accessToken).to.not.be.empty;
    });
  });

});