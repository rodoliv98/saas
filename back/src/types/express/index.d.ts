// src/types/express/index.d.ts
import 'express';
import { Logger } from 'winston';

declare module 'express-serve-static-core' {
  interface Request {
    user?: string;
    slug?: string;
    role?: string;
    cloud?: string;
    tenant?: string;
    logger: Logger;
  }
}