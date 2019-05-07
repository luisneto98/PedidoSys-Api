import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import { IUser } from 'interfaces/models/user';
import { IUserToken } from 'interfaces/tokens/user';
import { User } from 'models/user';

import * as service from './profile';

use(chaiAsPromise);

describe('app/services/profile', () => {
  const userToken: IUserToken = {
    id: 1,
    email: 'danielprado.ad@gmail.com',
    firstName: 'test',
    lastName: 'test',
    roles: []
  };

  const user: IUser = {
    email: 'danielprado.ad@gmail.com',
    firstName: 'test',
    lastName: 'test',
    roles: []
  };

  it('should update user profile', () => {
    return expect(service.save(user, userToken)).to.be.eventually.fulfilled.then((user: User) => {
      expect(user).to.be.not.undefined;
      expect(user.firstName).to.be.equal(user.firstName);
      expect(user.lastName).to.be.equal(user.lastName);
      expect(user.email).to.be.equal(user.email);
    });
  });

});