import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';

import { AdminModule } from './admin/module';

@Module({
  imports: [RouterModule.forRoutes([{ path: '/admin', module: AdminModule }]), AdminModule]
})
export class ApplicationModule {}
