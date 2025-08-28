import { UserRoleEnum } from '../utils/enum.util';
import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  role: UserRoleEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
