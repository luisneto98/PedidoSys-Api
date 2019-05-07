import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import { IUser } from 'interfaces/models/user';
import * as joi from 'joi';
import * as lodash from 'lodash';

import { validate } from './profile';

use(chaiAsPromise);

describe('app/validators/user', () => {
  const data: Partial<IUser> = {
    id: 1,
    firstName: 'Daniel',
    lastName: 'Prado',
    email: 'email@test.com'
  };

  it('should return valid for a minimun object', () => {
    const model = { firstName: data.firstName, email: data.email };
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

});