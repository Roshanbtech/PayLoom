import { Request, Response } from 'express';
import { AuthService } from './service';
import { env } from '../../config/env';

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    domain: env.COOKIE_DOMAIN,
    path: '/'
  };
}

export const AuthController = {
  signup: async (req: Request, res: Response) => {
    const requester = (req as any).user || null;
    const out = await AuthService.signup(requester, req.body);
    res.status(201).json(out);
  },
  login: async (req: Request, res: Response) => {
    const { token, user } = await AuthService.login(req.body);
    res.cookie(env.JWT_COOKIE_NAME, token, cookieOptions());
    // Return token as well (handy for dev/localStorage; for prod you can omit)
    res.json({ token, user });
  },
  logout: async (_req: Request, res: Response) => {
    res.clearCookie(env.JWT_COOKIE_NAME, { path: '/', domain: env.COOKIE_DOMAIN });
    res.json({ ok: true });
  },
  me: async (req: Request, res: Response) => {
    const user = await AuthService.me((req as any).user);
    res.json(user);
  }
};
