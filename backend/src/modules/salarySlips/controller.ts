import { Request, Response } from 'express';
import { SlipsService } from './service';
import { streamSlipPdf } from '../../pdf/slipPdf';
import { User } from '../users/model';

export const SlipsController = {
  create: async (req: Request, res: Response) => {
    const user = (req as any).user;
    const slip = await SlipsService.createSlip(user, req.body);
    res.status(201).json(slip);
  },
  update: async (req: Request, res: Response) => {
    const user = (req as any).user;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing slip id in request parameters' });
    }
    const doc = await SlipsService.updateSlip(user, id, req.body);
    res.json(doc);
  },
  mine: async (req: Request, res: Response) => {
    const user = (req as any).user;
    const slips = await SlipsService.listMySlips(user.sub, (req.query as any).month);
    res.json(slips);
  },
  pdf: async (req: Request, res: Response) => {
    const user = (req as any).user;
    const slipId = req.params.id;
    if (!slipId) {
      return res.status(400).json({ error: 'Missing slip id in request parameters' });
    }
    const slip = await SlipsService.getByIdForEmployee(user.sub, slipId);
    const employee = await User.findById(slip.employeeId).lean();
    streamSlipPdf(res, slip, { name: employee?.name ?? '', email: employee?.email ?? '' });
  },
  adminListAll: async (req: Request, res: Response) => {
    const user = (req as any).user;
    const list = await SlipsService.adminListAll(user, req.query as any);
    res.json(list);
  },
};
