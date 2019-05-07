/* tslint:disable */
import { IUserToken } from '../interfaces/tokens/user';
import * as express from 'express';

declare module "express" {
  interface Request {
    user: IUserToken;
  }
}