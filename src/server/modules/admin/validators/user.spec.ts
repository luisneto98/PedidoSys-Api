import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import { enRoles, IUser } from 'interfaces/models/user';
import * as joi from 'joi';
import * as lodash from 'lodash';

import { validate } from './user';

use(chaiAsPromise);

describe('admin/validators/user', () => {
  const data: IUser = {
    id: 1,
    firstName: 'Daniel',
    lastName: 'Prado',
    email: 'email@test.com',
    roles: [enRoles.admin]
  };

  it('should return valid for a minimun object', () => {
    const model = { firstName: data.firstName, email: data.email, roles: [enRoles.admin] };
    return expect(validate(model)).to.eventually.be.fulfilled as any;
  });

  it('should return valid for a full object', () => {
    const model = data;
    return expect(validate(model)).to.eventually.be.fulfilled as any;
  });

  it('should return invalid when id is less than 1', () => {
    const model = lodash.clone(data);
    model.id = 0;
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('id');
      expect(data.message[0].type).to.equal('number.min');
    });
  });

  it('should return invalid when firstName is empty', () => {
    const model = lodash.clone(data);
    delete model.firstName;
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('firstName');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when firstName length is less than 3', () => {
    const model = lodash.clone(data);
    model.firstName = 'te';
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('firstName');
      expect(data.message[0].type).to.equal('string.min');
    });
  });

  it('should return invalid when firstName length is greather than 50', () => {
    const model = lodash.clone(data);
    model.firstName = new Array(52).join('a');
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('firstName');
      expect(data.message[0].type).to.equal('string.max');
    });
  });

  it('should return invalid when lastName length is greather than 50', () => {
    const model = lodash.clone(data);
    model.lastName = new Array(52).join('a');
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('lastName');
      expect(data.message[0].type).to.equal('string.max');
    });
  });

  it('should return invalid when email is empty', () => {
    const model = lodash.clone(data);
    delete model.email;
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('email');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when email is invalid', () => {
    const model = lodash.clone(data);
    model.email = 'invalid email address';
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('email');
      expect(data.message[0].type).to.equal('string.email');
    });
  });

  it('should return invalid when email length is greather than 150', () => {
    const model = lodash.clone(data);
    model.email = new Array(152).join('a');
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message.some(m => m.path == 'email' && m.type == 'string.max')).to.be.true;
    });
  });

  it('should return invalid when roles is not present', () => {
    const model = lodash.clone(data);
    delete model.roles;
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('roles');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when roles is empty', () => {
    const model = { ...data, roles: [] as any };
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('roles');
      expect(data.message[0].type).to.equal('array.min');
    });
  });

  it('should return invalid when roles is duplicated', () => {
    const model = { ...data, roles: [enRoles.admin, enRoles.admin] };
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('roles.1');
      expect(data.message[0].type).to.equal('array.unique');
    });
  });

  it('shoud return invalid when an invalid role is added', () => {
    const model = lodash.clone(data);
    model.roles = ['nothing'] as any;
    return expect(validate(model)).to.eventually.be.rejected.then((data: any) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('roles.0');
      expect(data.message[0].type).to.equal('any.allowOnly');
    });
  });

});