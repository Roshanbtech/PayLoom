import Joi from 'joi';

export const signupBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  name: Joi.string().min(1).max(100).optional(),
  role: Joi.string().valid('admin','employee').default('employee').optional()
});

export const loginBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
