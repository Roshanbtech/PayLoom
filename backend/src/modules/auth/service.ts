import { UsersRepo } from '../users/repo';
import { hashPassword, comparePassword, signJwt } from '../../core/security';
import { ApiError } from '../../core/error';
import { sendMail } from '../../mailer/mailer';
import { welcomeEmail } from '../../mailer/templates/welcome';

export const AuthService = {
 async signup(requester: { role?: string } | null, body: any) {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const name = body.name?.trim();
    const requestedRole = body.role || 'employee';

    if (!email || !password) {
      throw new ApiError(400, 'BAD_REQUEST', 'Email and password are required');
    }

    const exists = await UsersRepo.findByEmail(email);
    if (exists) throw new ApiError(409, 'EMAIL_IN_USE', 'Email already registered');

    if (requestedRole === 'admin' && requester?.role !== 'admin') {
      throw new ApiError(403, 'FORBIDDEN', 'Only admin can create admin');
    }
    const finalRole = requester?.role === 'admin' ? requestedRole : 'employee';

    const passwordHash = await hashPassword(password);
    const user = await UsersRepo.create({ email, passwordHash, role: finalRole, name });

    try {
      const mail = welcomeEmail({
        nameOrEmail: user.name || user.email,
        createdByAdmin: !!requester,
        ...(requester?.role === 'admin' ? { tempPassword: password } : {}),
      });
      await sendMail(user.email, mail.subject, mail.html);
    } catch (err) {
      console.error('Welcome email failed:', err);
    }

    return { id: user._id.toString(), email: user.email, role: user.role, name: user.name };
  },

  async login({ email, password }: any) {
    const user = await UsersRepo.findByEmail(email);
    if (!user) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    const token = signJwt({ sub: user._id.toString(), role: user.role, email: user.email });
    return { token, user: { id: user._id.toString(), email: user.email, role: user.role, name: user.name } };
  },

  async me(userPayload: any) {
    return { id: userPayload.sub, email: userPayload.email, role: userPayload.role };
  }
};
