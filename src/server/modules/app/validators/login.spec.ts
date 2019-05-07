import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import * as joi from 'joi';
import * as _ from 'lodash';

import { validate } from './login';

use(chaiAsPromise);

describe('app/validators/login', () => {
  const data = {
    email: 'email@test.com',
    password: 'senha',
    deviceId: 'deviceId',
    deviceName: 'deviceName',
    notificationToken: 'a680e84f-334b-4556-b797-0070ad78f45d'
  };

  it('should return valid for a full object', () => {
    const model = data;
    return expect(validate(model)).to.eventually.be.fulfilled as any;
  });

  it('should return invalid when email is empty', () => {
    const model = _.clone(data);
    delete model.email;
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('email');
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

  it('should return invalid when deviceId is empty', () => {
    const model = _.clone(data);
    delete model.deviceId;
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('deviceId');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when deviceName is empty', () => {
    const model = _.clone(data);
    delete model.deviceName;
    return expect(validate(model)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('deviceName');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

});