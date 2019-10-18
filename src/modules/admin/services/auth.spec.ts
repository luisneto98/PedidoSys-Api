import { MailService } from 'modules/common/services/mail';
import { PasswordService } from 'modules/common/services/password';
import { TokenService } from 'modules/common/services/token';
import { UrlService } from 'modules/common/services/url';

import { UserRepository } from '../respoitories/user';
import { AuthService } from './auth';

describe('Admin/AuthService', () => {
  let tokenService: TokenService;
  let mailService: MailService;
  let urlService: UrlService;
  let userRepository: UserRepository;
  let passwordService: PasswordService;
  let service: AuthService;

  beforeEach(async () => {
    tokenService = new TokenService();
    mailService = new MailService(null);
    urlService = new UrlService();
    userRepository = new UserRepository();
    passwordService = new PasswordService();

    service = new AuthService(tokenService, mailService, urlService, userRepository, passwordService);
  });

  it('should return token for a valid user when try to login', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ password: 'senha' } as any);
    jest.spyOn(passwordService, 'compare').mockResolvedValueOnce(true);
    jest.spyOn(tokenService, 'generateAccessToken').mockResolvedValueOnce('app_access_token');

    const result = await service.login('email', 'senha');

    expect(result).not.toBeFalsy();
    expect(result).toEqual('app_access_token');
  });
});
