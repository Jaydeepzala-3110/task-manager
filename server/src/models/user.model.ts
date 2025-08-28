import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user.type';
import { UserRoleEnum } from '../utils/enum.util';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: UserRoleEnum,
      default: UserRoleEnum.MEMBER,
      index: true,
    },
  },
  { timestamps: true }
);

export type UserDocument = IUser;

const User = mongoose.model('User', userSchema);

export default User;
