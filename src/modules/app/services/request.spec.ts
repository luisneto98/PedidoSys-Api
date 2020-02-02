import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { IRequest } from 'modules/database/interfaces/request';
import { enRoles } from 'modules/database/interfaces/user';

import { RequestRepository } from './../repositories/request';
import { RequestService } from './request';

describe('App/RequestService', () => {
  let service: RequestService;
  let requestRepository: RequestRepository;

  const request: IRequest = {
    description: 'teste',
    quantity: 3,
    value: 2.1
  };

  const currentUser: ICurrentUser = {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'test@email.com',
    roles: [enRoles.user],
    id: 2
  };

  beforeEach(async () => {
    requestRepository = new RequestRepository();

    service = new RequestService(requestRepository);
  });

  it('should create a request', async () => {
    jest.spyOn(requestRepository, 'insert').mockImplementationOnce(request => Promise.resolve({ ...request } as any));

    const result = await service.save(request, currentUser);

    expect(result).not.toBeFalsy();
    expect(result).toEqual({ requesterId: currentUser.id, ...request });
  });

  it('should update a request', async () => {
    jest.spyOn(requestRepository, 'update').mockImplementationOnce(request => Promise.resolve({ ...request } as any));
    jest
      .spyOn(requestRepository, 'findById')
      .mockImplementationOnce(id =>
        Promise.resolve((id == 1 ? { id: 1, requesterId: currentUser.id, ...request } : null) as any)
      );

    const result = await service.save({ id: 1, requesterId: currentUser.id, ...request }, currentUser);

    expect(result).not.toBeFalsy();
    expect(result).toEqual({ id: 1, requesterId: currentUser.id, ...request });
  });

  it('should throw NotFoundException with request without in the base', async () => {
    jest.spyOn(requestRepository, 'update').mockImplementationOnce(request => Promise.resolve({ ...request } as any));
    jest.spyOn(requestRepository, 'findById').mockImplementationOnce(() => Promise.resolve(null as any));

    try {
      await service.save({ id: 1, requesterId: currentUser.id, ...request }, currentUser);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message.message).toBe('not-found');
    }
  });
  it('should throw BadRequestException with request other user', async () => {
    jest.spyOn(requestRepository, 'update').mockImplementationOnce(request => Promise.resolve({ ...request } as any));
    jest
      .spyOn(requestRepository, 'findById')
      .mockImplementationOnce(id =>
        Promise.resolve((id == 1 ? { id: 1, ...request, requesterId: currentUser.id + 1 } : null) as any)
      );

    try {
      await service.save({ id: 1, requesterId: currentUser.id, ...request }, currentUser);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('not-allowed-update-request');
    }
  });
});
