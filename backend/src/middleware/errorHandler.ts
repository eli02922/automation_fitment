import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ err }, 'Unhandled request error');
  const status = (err as { status?: number }).status ?? 500;
  res.status(status).json({
    error: status === 500 ? 'InternalServerError' : (err as Error).name,
    message: (err as Error).message ?? 'Unexpected error',
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'NotFound' });
}
