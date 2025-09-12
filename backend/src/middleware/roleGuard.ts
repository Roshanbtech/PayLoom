import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../core/error';

export function roleGuard(role: 'admin'|'employee') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== role) throw new ApiError(403, 'FORBIDDEN', 'Insufficient role');
    next();
  };
}
