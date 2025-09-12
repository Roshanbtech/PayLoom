import { UsersRepo } from './repo';

function escRegex(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function sanitize(u: any) { return u ? { id: String(u._id), name: u.name, email: u.email, role: u.role } : null; }

export const UsersService = {
  async list({ role, q, limit }: { role?: 'employee'|'admin'; q?: string; limit?: number }) {
    const filter: any = {};
    if (role) filter.role = role;
    if (q && q.trim()) {
      const rx = new RegExp(escRegex(q.trim()), 'i');
      filter.$or = [{ name: rx }, { email: rx }];
    }
    const docs = await UsersRepo.listLite(filter, limit ?? 20);
    return docs.map(sanitize);
  },

  async getOne(id: string) {
    const u = await UsersRepo.getLiteById(id);
    return sanitize(u);
  },
};
