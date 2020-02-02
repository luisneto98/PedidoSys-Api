import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequired, CurrentUser } from 'modules/common/guards/token';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { Request } from 'modules/database/models/request';

import { RequestService } from '../services/request';
import { SaveValidator } from '../validators/request/save';
import { RequestRepository } from './../repositories/request';
import { ListValidator } from './../validators/request/list';

@ApiTags('App: Request')
@Controller('/request')
@AuthRequired()
export class RequestController {
  constructor(private requestRepository: RequestRepository, private requestService: RequestService) {}

  @Post()
  @ApiResponse({ status: 200, type: Request })
  public async save(@Body() model: SaveValidator, @CurrentUser() currentUser: ICurrentUser) {
    return this.requestService.save(model, currentUser);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Request] })
  public async list(@Query() model: ListValidator, @CurrentUser() currentUser: ICurrentUser) {
    return this.requestRepository.list(model, currentUser);
  }

  @Get(':requestId')
  public async details(@Param('requestId', ParseIntPipe) requestId: number, @CurrentUser() currentUser: ICurrentUser) {
    return this.requestService.details(requestId, currentUser);
  }

  @Delete(':requestId')
  public async delete(@Param('requestId', ParseIntPipe) requestId: number, @CurrentUser() currentUser: ICurrentUser) {
    return this.requestService.remove(requestId, currentUser);
  }
}
