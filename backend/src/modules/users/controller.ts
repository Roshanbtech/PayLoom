import { Request, Response } from 'express';
import { UsersService } from './service';

export const UsersController = {
  list: async (req: Request, res: Response) => {
    const { role, q, limit } = req.query as any;
    const params: { role?: "employee" | "admin"; q?: string; limit?: number } = { role, q };
    if (limit !== undefined) {
      params.limit = Number(limit);
    }
    const data = await UsersService.list(params);
    res.json(data); // [{ id, name, email, role }]
  },

  getOne: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }
    const data = await UsersService.getOne(id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data); // { id, name, email, role }
  },
};
