export interface IRequest {
  id?: number;
  requesterId?: number;
  description: string;
  quantity?: number;
  value?: number;

  createdDate?: Date;
  updatedDate?: Date;
}
