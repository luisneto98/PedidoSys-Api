import { Injectable } from '@nestjs/common';
import { IPaginationParams } from 'modules/common/interfaces/pagination';
import { Request } from 'modules/database/models/request';
import { Page, Transaction } from 'objection';

@Injectable()
export class RequestRepository {
  public async list(params: IPaginationParams, transaction?: Transaction): Promise<Page<Request>> {
    let query = Request.query(transaction)
      .select('*')
      .page(params.page, params.pageSize);

    if (params.orderBy) {
      query = query.orderBy(params.orderBy, params.orderDirection);
    }

    return query;
  }
}
