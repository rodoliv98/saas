import { NextFunction, Request, Response } from "express";
import logger from "../lib/winston/winston";
import crypto from 'crypto';

export function requestLogger (req: Request, _res: Response, next: NextFunction) {
  const now = new Date().toISOString();

  req.logger = logger.child({
    requestId: crypto.randomUUID(),
    http: {
      method: req.method,
      path: req.path,
      ip: req.ip,
      timestamp: now,
    }
  });

  /* res.once('finish', () => {
    if (req.path === '/refresh') return;
    if (req.method === 'OPTIONS') return;

    req.logger.info('request_completed', {
      durationMs: Date.now() - startTime
    })
  }); */

  next();
}