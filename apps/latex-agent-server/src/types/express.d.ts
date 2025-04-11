import { Request } from 'express';
import { User } from '../models';

declare global {
  namespace Express {
    interface Request {
      user?: User & { isAdmin: boolean };
    }
  }
}