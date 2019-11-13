import { ConflictException, Injectable } from '@nestjs/common';
import { IUser } from 'interfaces/models/user';
import { ICurrentUser } from 'interfaces/tokens/currentUser';
import { User } from 'modules/database/models/user';

import { UserRepository } from '../repositories/user';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async update(model: IUser, currentUser: ICurrentUser): Promise<User> {
    delete model.id;

    const user = await this.userRepository.findById(currentUser.id);

    if (user.email !== model.email) {
      const isEmailAvailable = await this.userRepository.isEmailAvailable(model.email);
      if (!isEmailAvailable) throw new ConflictException('email-unavailable');
    }

    return this.userRepository.update({ ...user, ...model });
  }
}
