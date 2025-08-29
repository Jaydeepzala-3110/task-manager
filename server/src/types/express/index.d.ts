import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      authUser?: Document | any;
    }
  }
}

export {};