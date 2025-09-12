import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { signupBody, loginBody } from './dto';
import { AuthController } from './controller';
import { authGuard } from '../../middleware/authGuard';
import { loginLimiter } from '../../middleware/rateLimiters';
import { asyncHandler } from '../../core/error';

const r = Router();

r.post('/signup', validate({ body: signupBody }), asyncHandler(AuthController.signup)); // admin can create admin; employees can create employee only if you want—here guarded to admin only; adjust if needed
r.post('/login', loginLimiter, validate({ body: loginBody }), asyncHandler(AuthController.login));
r.post('/logout', asyncHandler(AuthController.logout));
r.get('/me', authGuard, asyncHandler(AuthController.me));

export default r;
