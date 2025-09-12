import Joi from 'joi';

const line = Joi.object({ name: Joi.string().min(1).required(), amount: Joi.number().min(0).required() });

export const createSlipBody = Joi.object({
  employeeId: Joi.string().required(),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  earnings: Joi.object({
    basic: Joi.number().min(0).required(),
    hra: Joi.number().min(0).optional(),
    allowances: Joi.array().items(line).optional()
  }).required(),
  deductions: Joi.object({
    tax: Joi.number().min(0).optional(),
    other: Joi.array().items(line).optional()
  }).optional(),
  notes: Joi.string().allow('').optional()
});

export const updateSlipBody = createSlipBody.fork(
  ['employeeId','month','earnings','deductions','notes'],
  (s: any) => s.optional()
);

export const getMineQuery = Joi.object({
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).optional()
});

export const adminListQuery = Joi.object({
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).optional(), 
  employeeId: Joi.string().optional(),
  q: Joi.string().allow('').optional(),                    
});

export const paramsWithId = Joi.object({ id: Joi.string().required() });
