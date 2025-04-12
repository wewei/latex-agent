import { Request } from 'express';
import { User } from '../models';

export type AuthRequest = Request & {
  user?: User & { isAdmin: boolean };
}
