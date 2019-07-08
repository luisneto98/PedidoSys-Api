import * as service from './bcrypt';

describe('services/bcrypt', () => {

  it('should hash a valid password', async () => {
    const password = 'senha@123';

    return expect(service.hash(password)).toResolve().then((hash: string) => {
      expect(hash).toBeString();
      return expect(service.compare(hash, password)).toResolve();
    });
  });

});