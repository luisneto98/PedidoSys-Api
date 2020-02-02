import { Injectable } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { IPaginationParams } from 'modules/common/interfaces/pagination';
import { IRequest } from 'modules/database/interfaces/request';
import { Request } from 'modules/database/models/request';
import { Page, Transaction } from 'objection';

@Injectable()
export class RequestRepository {
  public async list(
    params: IPaginationParams,
    currentUser: ICurrentUser,
    transaction?: Transaction
  ): Promise<Page<Request>> {
    let query = Request.query(transaction)
      .select('*')
      .where('requesterId', '=', currentUser.id)
      .page(params.page, params.pageSize);

    if (params.orderBy) {
      query = query.orderBy(params.orderBy, params.orderDirection);
    }
    if (params.term) {
      query = query.where(query => {
        return query.where('description', 'ilike', `%${params.term}%`);
      });
    }

    return query;
  }

  public async findById(id: number, transaction: Transaction = null): Promise<Request> {
    return Request.query(transaction).findById(id);
  }

  public async findByRequesterId(requesterId: number, transaction?: Transaction): Promise<Array<Request>> {
    return Request.query(transaction).where({ requesterId });
  }

  public async insert(model: IRequest, transaction: Transaction = null): Promise<Request> {
    return Request.query(transaction).insertAndFetch(model as any);
  }

  public async update(model: IRequest, transaction: Transaction = null): Promise<Request> {
    return Request.query(transaction).patchAndFetchById(model.id, model as any);
  }

  public async remove(requestId: number, transaction: Transaction = null): Promise<void> {
    await Request.query(transaction).deleteById(requestId);
  }
}
