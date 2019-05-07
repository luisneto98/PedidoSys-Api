import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import { IPaginationParams } from 'interfaces/pagination';
import * as joi from 'joi';

import { validate } from './pagination';

use(chaiAsPromise);

describe('validators/pagination', () => {
  const model: IPaginationParams = {
    term: '',
    page: 0,
    pageSize: 10,
    orderBy: 'name',
    orderDirection: 'asc'
  };

  const columns = ['name'];

  it('should return valid for a full object', () => {
    validate(model, columns).catch(err => console.table(err.message));
    return expect(validate(model, columns)).to.eventually.be.fulfilled as any;
  });

  it('should return valid for a minimum object', () => {
    return expect(validate({ page: 0, pageSize: 10 }, columns)).to.eventually.be.fulfilled as any;
  });

  it('should return invalid when term is not a string', () => {
    const data = { ...model, term: 1 };

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('term');
      expect(data.message[0].type).to.equal('string.base');
    });
  });

  it('should return invalid when page is not present', () => {
    const data = { ...model };
    delete data.page;

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('page');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when page is not a number', () => {
    const data = { ...model, page: 't' };

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('page');
      expect(data.message[0].type).to.equal('number.base');
    });
  });

  it('should return invalid when page is less than 0', () => {
    const data = { ...model, page: -1 };

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('page');
      expect(data.message[0].type).to.equal('number.min');
    });
  });

  it('should return invalid when pageSize is not present', () => {
    const data = { ...model };
    delete data.pageSize;

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('pageSize');
      expect(data.message[0].type).to.equal('any.required');
    });
  });

  it('should return invalid when pageSize is not a number', () => {
    const data = { ...model, pageSize: 't' };

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('pageSize');
      expect(data.message[0].type).to.equal('number.base');
    });
  });

  it('should return invalid when pageSize is less than 1', () => {
    const data = { ...model, pageSize: 0 };

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('pageSize');
      expect(data.message[0].type).to.equal('number.min');
    });
  });

  it('should return invalid when orderBy is not a string', () => {
    const data = { ...model, orderBy: 1 };

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('orderBy');
      expect(data.message[0].type).to.equal('string.base');
    });
  });

  it('should return invalid when orderBy is not a valid column', () => {
    const data = { ...model, orderBy: 'invalid' };

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('orderBy');
      expect(data.message[0].type).to.equal('any.allowOnly');
    });
  });

  it('should return invalid when orderDirection is not a string', () => {
    const data = { ...model, orderDirection: 1 };

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('orderDirection');
      expect(data.message[0].type).to.equal('string.base');
    });
  });

  it('should return invalid when orderDirection is not a asc or desc', () => {
    const data = { ...model, orderDirection: 'invalid' };

    return expect(validate(data, columns)).to.eventually.be.rejected.then((data: joi.CustomValidationError) => {
      expect(data.validationError).to.be.true;
      expect(data.message).to.have.length(1);
      expect(data.message[0].path).to.equal('orderDirection');
      expect(data.message[0].type).to.equal('any.allowOnly');
    });
  });
});
