import { PasswordService } from './password';

describe('Admin/PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    service = new PasswordService();
  });

  it('should generate a valid password with a valid hash', async () => {
    return service
      .generatePassword()
      .then(({ password, hash }) => {
        expect(typeof password).toBe('string');
        expect(typeof hash).toBe('string');
        return service.compare(hash, password);
      })
      .then(isValid => {
        expect(isValid).toBeTrue();
      });
  });

  it('should hash a password with a valid hash', async () => {
    return service
      .hash('senha@123')
      .then(hash => {
        expect(typeof hash).toBe('string');
        return service.compare(hash, 'senha@123');
      })
      .then(isValid => {
        expect(isValid).toBeTrue();
      });
  });

  it('should return invalid when a invalid password', async () => {
    return service
      .hash('senha@123')
      .then(hash => {
        expect(typeof hash).toBe('string');
        return service.compare(hash, 'senha@1234');
      })
      .then(isValid => {
        expect(isValid).toBeFalse();
      });
  });

  it('should return invalid when a invalid hash is pass', async () => {
    return service.compare('invalid', 'senha@1234').then(isValid => {
      expect(isValid).toBeFalse();
    });
  });
});
