import { Router } from 'express';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';
import { validate } from '../../middleware/validate';
import { createSlipBody, updateSlipBody, getMineQuery, paramsWithId, adminListQuery } from './dto';
import { SlipsController } from './controller';
import { asyncHandler } from '../../core/error';


const r = Router();

r.post('/', authGuard, roleGuard('admin'), validate({ body: createSlipBody }), asyncHandler(SlipsController.create));
r.put('/:id', authGuard, roleGuard('admin'), validate({ params: paramsWithId, body: updateSlipBody }), asyncHandler(SlipsController.update));

r.get('/', authGuard, validate({ query: getMineQuery }), asyncHandler(SlipsController.mine));
r.get('/:id/pdf', authGuard, validate({ params: paramsWithId }), asyncHandler(SlipsController.pdf));
r.get('/admin/all',
  authGuard,
  roleGuard('admin'),
  validate({ query: adminListQuery }),
  asyncHandler(SlipsController.adminListAll)
);

export default r;
