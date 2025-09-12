import { Router } from 'express';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../core/error';
import { UsersController } from './controller';
import { listUsersQuery, paramsWithId } from './dto';

const r = Router();

r.get('/', authGuard, roleGuard('admin'),
  validate({ query: listUsersQuery }),
  asyncHandler(UsersController.list)
);

r.get('/:id', authGuard, roleGuard('admin'),
  validate({ params: paramsWithId }),
  asyncHandler(UsersController.getOne)
);

export default r;
