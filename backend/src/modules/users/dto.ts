import Joi from 'joi';

const objectId = Joi.string().regex(/^[a-fA-F0-9]{24}$/).message('must be a valid 24-char ObjectId');

export const listUsersQuery = Joi.object({
  role: Joi.string().valid('employee', 'admin').default('employee'),
  q: Joi.string().trim().allow('').optional(),
  limit: Joi.number().integer().min(1).max(50).default(20),
}).options({ abortEarly: false, convert: true, stripUnknown: true });

export const paramsWithId = Joi.object({
  id: objectId.required(),
}).options({ abortEarly: false, convert: true, stripUnknown: true });
