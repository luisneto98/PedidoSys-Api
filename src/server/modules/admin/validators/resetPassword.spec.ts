import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import * as joi from 'joi';
import * as _ from 'lodash';

import { validate } from './resetPassword';

use(chaiAsPromise);

describe('admin/validators/resetPassword', () => {
  const data = {
    token: 'token',
    password: 'senha'
  };

  it('should return valid for a full object', () => {
    const model = data;
    return expect(validate(model)).to.eventually.be.fulfilled as any;
  });

  it('should return invalid when token is empty', () => {
    const model = _.clone(data);
    delete model.token;

    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('token');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when password is empty', () => {
    const model = _.clone(data);
    delete model.password;

    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('password');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when password length is less than 3', () => {
    const model = _.clone(data);
    model.password = 'te';

    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('password');
      expect(data.message[0].type).to.equal('string.min');
    });
  });

  it('should return invalid when password length is greather than 100', () => {
    const model = _.clone(data);
    model.password = new Array(102).join('a');

    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('password');
      expect(data.message[0].type).to.equal('string.max');
    });
  });

});