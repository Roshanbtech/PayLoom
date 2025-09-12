import { Request, Response, NextFunction } from 'express';
import type { ObjectSchema } from 'joi';

export function validate(schema: {
  body?: ObjectSchema,
  query?: ObjectSchema,
  params?: ObjectSchema
}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Body IS writable in Express 5 -> safe to assign back
      if (schema.body) {
        const { value, error } = schema.body.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return next({ status: 400, code: 'VALIDATION_ERROR', message: error.message });
        req.body = value as any;
      }

      // query/params are getter-only -> put sanitized copies on custom props
      if (schema.query) {
        const { value, error } = schema.query.validate(req.query, { abortEarly: false, stripUnknown: true });
        if (error) return next({ status: 400, code: 'VALIDATION_ERROR', message: error.message });
        (req as any).validatedQuery = value;
      }

      if (schema.params) {
        const { value, error } = schema.params.validate(req.params, { abortEarly: false, stripUnknown: true });
        if (error) return next({ status: 400, code: 'VALIDATION_ERROR', message: error.message });
        (req as any).validatedParams = value;
      }

      next();
    } catch (e) {
      next(e);
    }
  };
}
