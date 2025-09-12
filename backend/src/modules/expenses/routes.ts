import { Router } from 'express';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';
import { validate } from '../../middleware/validate';
import { createExpenseBody, getMyExpensesQuery, paramsWithId, updateStatusBody } from './dto';
import { ExpensesController } from './controller';
import { asyncHandler } from '../../core/error';

const r = Router();

r.post('/', authGuard, roleGuard('employee'), validate({ body: createExpenseBody }), asyncHandler(ExpensesController.create));
r.get('/', authGuard, roleGuard('employee'), validate({ query: getMyExpensesQuery }), asyncHandler(ExpensesController.mine));

r.get('/admin/all', authGuard, roleGuard('admin'), asyncHandler(ExpensesController.adminListAll));
r.put('/admin/:id/status', authGuard, roleGuard('admin'), validate({ params: paramsWithId, body: updateStatusBody }), asyncHandler(ExpensesController.adminUpdateStatus));

export default r;
