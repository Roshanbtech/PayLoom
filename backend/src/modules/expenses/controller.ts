import { Request, Response } from 'express';
import { ExpensesService } from './service';

export const ExpensesController = {
  create: async (req: Request, res: Response) => {
    const user = (req as any).user;
    const doc = await ExpensesService.submitExpense(user, req.body);
    res.status(201).json(doc);
  },
  mine: async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { from, to } = req.query as any;
    const list = await ExpensesService.listMine(user, { from, to });
    res.json(list);
  },
  adminUpdateStatus: async (req: Request, res: Response) => {
    const user = (req as any).user;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Expense ID is required' });
    }
    const doc = await ExpensesService.adminUpdateStatus(user, id, req.body.status);
    res.json(doc);
  },
  adminListAll: async (req: Request, res: Response) => {
    const user = (req as any).user;
    const list = await ExpensesService.adminListAll(user);
    res.json(list);
  }
};
