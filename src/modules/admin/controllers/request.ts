import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequired } from 'modules/common/guards/token';
import { Request } from 'modules/database/models/request';

import { RequestRepository } from './../repositories/request';
import { ListValidator } from './../validators/request/list';

@ApiTags('App: Request')
@Controller('/request')
@AuthRequired()
export class RequestController {
  constructor(private requestRepository: RequestRepository) {}
  @Get()
  @ApiResponse({ status: 200, type: [Request] })
  public async list(@Query() model: ListValidator) {
    return this.requestRepository.list(model);
  }
}
