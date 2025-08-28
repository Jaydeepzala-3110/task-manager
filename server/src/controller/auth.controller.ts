import User from "../models/user.model";
import { RegisterRequestBody, RegisterResponse } from "../types/auth.type";
import { getToken, hashPassword } from "../utils/auth.util";
import { TokenTypeEnum } from "../utils/enum.util";
import { logger } from "../utils/logger";
import { internalServerErrorResponse, successResponse, unauthorizedResponse } from "../utils/response.util";
import { Request, Response } from 'express';


const register = async (req: Request, res: Response): Promise<RegisterResponse> => {
  try {

    logger.info('calling register')

    let { username, email, password } : RegisterRequestBody= req.body ;

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ $or: [{ email }] });

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

    const newUser= {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };

    return successResponse(res, 'User registered successfully', { accessToken, newUser});
  } catch (error) {
    logger.error(error);

    return internalServerErrorResponse(res, 'Something went wrong!', error);
  }
};

export { register };
