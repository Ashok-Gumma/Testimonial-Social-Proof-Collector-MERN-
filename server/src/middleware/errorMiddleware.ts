import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('❌ Error caught by global handler:', err);

  if (err instanceof ZodError) {
    const issues = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: issues,
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid ID format for parameter: ${err.path || 'resource'}.`,
    });
    return;
  }

  if (err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      message: err.message || 'File upload error.',
    });
    return;
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'record';
    res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const isProduction = env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
  });
};

