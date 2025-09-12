import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../core/security';
import { ApiError } from '../core/error';
import { env } from '../config/env';

export function authGuard(req: Request, _res: Response, next: NextFunction) {
  const auth = req.header('Authorization') || '';
  const headerToken = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const cookieToken = (req as any).cookies?.[env.JWT_COOKIE_NAME];
  const token = headerToken || cookieToken;
  if (!token) throw new ApiError(401, 'UNAUTHORIZED', 'Missing token');
  try {
    const payload = verifyJwt<{ sub: string; role: 'admin'|'employee'; email: string }>(token);
    (req as any).user = payload;
    next();
  } catch {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid token');
  }
}
