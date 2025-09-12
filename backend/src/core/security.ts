import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../config/env';

const secret: Secret = env.JWT_SECRET;

// 7 days in seconds
const DEFAULT_EXP_SECONDS = 60 * 60 * 24 * 7;

export function signJwt(payload: object, expiresIn: number = DEFAULT_EXP_SECONDS): string {
  const options: SignOptions = { expiresIn }; 
  return jwt.sign(payload, secret, options);
}

export function verifyJwt<T = JwtPayload>(token: string): T {
  return jwt.verify(token, secret) as T;
}

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function comparePassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}
