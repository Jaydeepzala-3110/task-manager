import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import { TokenTypeEnum, UserStatusEnum } from '../utils/enum.util';
import { verifyToken } from '../utils/auth.util';
import { unauthorizedResponse } from '../utils/response.util';

export function auth(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorizationHeader = req.headers['authorization'];
      const tokenString = authorizationHeader?.split(' ')[1];

      const decodedToken: any = verifyToken(tokenString as string);

      if (
        !decodedToken ||
        !decodedToken?.role ||
        decodedToken?.type !== TokenTypeEnum.Auth
      ) {
        return unauthorizedResponse(res, 'Access denied');
      }

      const user = await User.findOne({
        _id: decodedToken.id,
        role: decodedToken.role,
        status: UserStatusEnum.Active,
      });

      if (!user) {
        return unauthorizedResponse(res, 'Access denied');
      }

      req.authUser = user;

      if (!roles?.length) {
        return next();
      }

      if (!roles.includes(decodedToken.role)) {
        return unauthorizedResponse(res, 'Access denied');
      }

      next();
    } catch (error) {
      return unauthorizedResponse(res, 'Access denied');
    }
  };
}
