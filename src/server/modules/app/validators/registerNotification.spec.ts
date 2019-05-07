import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';

import { validate } from './registerNotification';

use(chaiAsPromise);

describe('app/validators/registerNotification', () => {
  it('should return valid', () => {
    return expect(validate({
      notificationToken: '123',
      deviceId: '123',
      application: '123'
    })).to.eventually.be.fulfilled as any;
  });

  it('should return invalid', () => {
    return expect(validate({})).to.eventually.be.rejected;
  });

});