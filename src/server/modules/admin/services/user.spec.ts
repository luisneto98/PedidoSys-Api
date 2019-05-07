import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import { ServiceError } from 'errors/service';
import { enRoles, IUser } from 'interfaces/models/user';
import { User } from 'models/user';

import * as service from './user';

use(chaiAsPromise);

describe('admin/services/user', () => {
  const user: IUser = {
    id: 2,
    email: 'test' + Date.now() + '@email.com',
    firstName: 'test',
    lastName: 'test',
    roles: [enRoles.admin]
  };

  it('should create a new user', () => {
    const data: IUser = {
      ...user,
      id: null
    };

    return expect(service.save(data)).to.be.eventually.fulfilled.then((user: User) => {
      expect(user).to.be.not.undefined;
      expect(user.password).to.be.not.undefined;
      expect(user.password).to.be.not.null;
      expect(user.password).to.be.string;
      expect(user.createdDate).to.be.instanceof(Date);
      expect(user.createdDate.getTime()).not.to.be.NaN;
      expect(user.password[0]).to.equal('$');
      expect(user.roles).to.be.not.empty;
      expect(user.roles[0]).to.be.equal(enRoles.admin);
    });
  });

  it('should allow to update the user', () => {
    const data: IUser = {
      ...user,
      email: 'new-admin@email.com'
    };

    return expect(service.save(data)).to.be.eventually.fulfilled.then((user: User) => {
      expect(user).to.be.not.undefined;
      expect(user.id).to.be.equal(data.id);
      expect(user.email).to.be.equal(data.email);
    });
  });

  it('should not allow to save an user without roles', () => {
    const data: IUser = {
      ...user,
      roles: []
    };

    return expect(service.save(data)).to.be.eventually.rejected.then((err: Error) => {
      expect(err instanceof ServiceError).to.be.true;
      expect(err.message).to.be.equal('roles-required');
    });
  });

  it('should not allow to save a sysAdmin user', () => {
    const data: IUser = {
      ...user,
      roles: [enRoles.sysAdmin]
    };

    return expect(service.save(data)).to.be.eventually.rejected.then((err: Error) => {
      expect(err instanceof ServiceError).to.be.true;
      expect(err.message).to.be.equal('not-allowed-to-change-sysAdmin');
    });
  });

  it('should not allow to save an user with an invalid role', () => {
    const data: IUser = {
      ...user,
      roles: ['not-valid'] as any
    };

    return expect(service.save(data)).to.be.eventually.rejected.then((err: Error) => {
      expect(err instanceof ServiceError).to.be.true;
      expect(err.message).to.be.equal('invalid-roles');
    });
  });

  it('should not allow to save a user with same email', () => {
    const data: IUser = {
      ...user,
      id: null,
      email: 'new-admin@email.com'
    };

    console.log(data);

    return expect(service.save(data)).to.be.eventually.rejected.then((err: Error) => {
      expect(err instanceof ServiceError).to.be.true;
      expect(err.message).to.be.equal('email-unavailable');
    });
  });

  it('should allow remove a user', () => {
    return expect(service.remove(user.id, { id: null } as any)).to.be.eventually.fulfilled as any;
  });

  it('should not allow remove an sysAdmin user', () => {
    return expect(service.remove(1, { id: null } as any)).to.be.eventually.rejected.then((err: Error) => {
      expect(err instanceof ServiceError).to.be.true;
      expect(err.message).to.be.equal('not-allowed-remove-sysAdmin');
    });
  });

  it('should not allow remove the current user', () => {
    return expect(service.remove(1, { id: 1 } as any)).to.be.eventually.rejected.then((err: Error) => {
      expect(err instanceof ServiceError).to.be.true;
      expect(err.message).to.be.equal('not-allowed-remove-current-user');
    });
  });
});