import 'dotenv/config';
import {
  sign,
  verify,
  type Secret,
  type SignOptions,
  type JwtPayload,
} from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';

const getToken = (
  payload: string | Buffer | Record<string, unknown>,
  expiresIn: string | number = '12h'
) => {
  const secret: Secret = process.env.JWT_SECRET as Secret;
  const options: SignOptions = { expiresIn: expiresIn as any };
  return sign(payload, secret, options);
};

const verifyToken = (token: string) => {
  const secret: Secret = process.env.JWT_SECRET as Secret;
  return verify(token, secret) as JwtPayload | string;
};

const hashPassword = async (password: string) => {
  return await hash(password, 12);
};

const verifyPassword = async (password: string, hash: string) => {
  return await compare(password, hash);
};

export { hashPassword, verifyPassword, getToken, verifyToken };
