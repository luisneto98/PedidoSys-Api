import 'source-map-support/register';

import * as chaiAsPromise from 'chai-as-promised';
import * as service from './bcrypt';

import { expect, use } from 'chai';

use(chaiAsPromise);

describe('services/bcrypt', () => {

  it('should hash a valid password', () => {
    const password = 'senha@123';

    return expect(service.hash(password)).to.eventually.be.fulfilled.then((hash: string) => {
      expect(hash).to.be.a('string');
      return expect(service.compare(hash, password)).to.eventually.be.fulfilled as any;
    });
  });

});