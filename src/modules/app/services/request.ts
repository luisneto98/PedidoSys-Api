import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { Request } from 'modules/database/models/request';

import { IRequest } from './../../database/interfaces/request';
import { RequestRepository } from './../repositories/request';

@Injectable()
export class RequestService {
  constructor(private requestRepository: RequestRepository) {}

  public async save(model: IRequest, currentUser: ICurrentUser): Promise<Request> {
    if (model.id) return this.update(model, currentUser);
    return this.create(model, currentUser);
  }

  public async remove(requestId: number, currentUser: ICurrentUser): Promise<void> {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new NotFoundException('not-found');
    }

    if (request.requesterId !== currentUser.id) {
      throw new BadRequestException('not-allowed-remove-request-of-other-user');
    }

    return this.requestRepository.remove(requestId);
  }

  public async details(requestId: number, currentUser: ICurrentUser): Promise<Request> {
    const request = await this.requestRepository.findById(requestId);

    if (!request) throw new NotFoundException('not-found');
    if (currentUser.id != request.requesterId) throw new BadRequestException('not-allowed-get-request');

    return request;
  }

  private async create(model: IRequest, currentUser: ICurrentUser): Promise<Request> {
    model.requesterId = currentUser.id;
    const user = await this.requestRepository.insert(model);
    return user;
  }

  private async update(model: IRequest, currentUser: ICurrentUser): Promise<Request> {
    const request = await this.requestRepository.findById(model.id);

    if (!request) throw new NotFoundException('not-found');
    if (currentUser.id != request.requesterId) throw new BadRequestException('not-allowed-update-request');

    const requestUpdated = await this.requestRepository.update({ ...request, ...model });
    return requestUpdated;
  }
}
