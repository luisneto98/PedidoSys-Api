import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import * as joi from 'joi';
import * as _ from 'lodash';

import { validate } from './changePassword';

use(chaiAsPromise);

describe('admin/validators/changePassword', () => {
  const data = {
    currentPassword: 'token',
    newPassword: 'senha'
  };

  it('should return valid for a full object', () => {
    const model = data;
    return expect(validate(model)).to.eventually.be.fulfilled as any;
  });

  it('should return invalid when currentPassword is empty', () => {
    const model = _.clone(data);
    delete model.currentPassword;
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('currentPassword');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when newPassword is empty', () => {
    const model = _.clone(data);
    delete model.newPassword;

    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('newPassword');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when newPassword length is less than 3', () => {
    const model = _.clone(data);
    model.newPassword = 'te';

    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('newPassword');
      expect(data.message[0].type).to.equal('string.min');
    });
  });

  it('should return invalid when newPassword length is greather than 100', () => {
    const model = _.clone(data);
    model.newPassword = new Array(102).join('a');

    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('newPassword');
      expect(data.message[0].type).to.equal('string.max');
    });
  });

});