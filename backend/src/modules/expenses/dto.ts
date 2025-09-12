import Joi from 'joi';

export const createExpenseBody = Joi.object({
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  category: Joi.string().valid('Travel','Internet','Meal','Other').required(),
  amount: Joi.number().min(0).required(),
  description: Joi.string().allow('').optional()
});

export const getMyExpensesQuery = Joi.object({
  from: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export const paramsWithId = Joi.object({ id: Joi.string().required() });
export const updateStatusBody = Joi.object({
  status: Joi.string().valid('approved','rejected').required()
});
