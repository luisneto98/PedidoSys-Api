import { HttpModule, Module } from '@nestjs/common';
import { CommonModule } from 'modules/common/module';
import { DatabaseModule } from 'modules/database/module';

import { AuthController } from './controllers/auth';
import { ProfileController } from './controllers/profile';
import { RequestController } from './controllers/request';
import { DeviceRepository } from './repositories/device';
import { RequestRepository } from './repositories/request';
import { UserRepository } from './repositories/user';
import { AuthService } from './services/auth';
import { RequestService } from './services/request';
import { UserService } from './services/user';

@Module({
  imports: [HttpModule, CommonModule, DatabaseModule],
  controllers: [AuthController, ProfileController, RequestController],
  providers: [AuthService, UserService, UserRepository, DeviceRepository, RequestRepository, RequestService]
})
export class AppModule {}
