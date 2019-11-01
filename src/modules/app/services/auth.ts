import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PasswordService } from 'modules/common/services/password';
import { TokenService } from 'modules/common/services/token';

import { UserRepository } from '../respoitories/user';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
    private passwordService: PasswordService
  ) {}

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException();

    const isValid = await this.passwordService.compare(user.password, password);
    if (!isValid) throw new BadRequestException();

    return this.tokenService.generateAccessToken(user);
  }
}
