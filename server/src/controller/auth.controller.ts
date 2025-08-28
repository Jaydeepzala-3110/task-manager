import User from '../models/user.model';
import { LoginRequestBody, RegisterRequestBody } from '../types/auth.type';
import { getToken, hashPassword } from '../utils/auth.util';
import { TokenTypeEnum } from '../utils/enum.util';
import { logger } from '../utils/logger';
import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
  badRequestResponse,
} from '../utils/response.util';
import { Request, Response } from 'express';
import { compare } from 'bcrypt';

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    let { username, email, password }: RegisterRequestBody = req.body;

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return unauthorizedResponse(
        res,
        'You already have an existing account, please login using your email address'
      );
    }

    password = await hashPassword(password);

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const accessToken = getToken({
      id: user._id,
      role: user.role,
      type: TokenTypeEnum.Auth,
    });

    const newUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return successResponse(res, 'User registered successfully', { accessToken, newUser });
  } catch (error) {
    logger.error(error);

    return internalServerErrorResponse(res, 'Something went wrong!', error);
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequestBody = req.body;

    if (!email || !password) {
      return badRequestResponse(res, 'Email and password are required');
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return unauthorizedResponse(res, 'Invalid email or password');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return unauthorizedResponse(res, 'Invalid email or password');
    }

    const accessToken = getToken({
      id: user._id,
      role: user.role,
      type: TokenTypeEnum.Auth,
    });

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return successResponse(res, 'Login successful', { accessToken, ususerDataer });
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Something went wrong!', error);
  }
};

export { register, login };
