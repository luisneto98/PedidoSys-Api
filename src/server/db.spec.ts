import 'app-module-path/register';
import 'source-map-support/register';

import { expect, use } from 'chai';
import * as chaiAsPromise from 'chai-as-promised';

import * as db from './db';
import { env } from './settings';

use(chaiAsPromise);
console.log('Environment: ', env);

describe('db', () => {

  it('should migrate memory db', () => {
    return expect(db.connectAndMigrate()).to.be.eventually.fulfilled as any;
  });

});
