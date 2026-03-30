import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { ErrorCode } from "../types/constants/error-codes-constants";
import {
  PrismaClientKnownRequestError, 
  PrismaClientUnknownRequestError, 
  PrismaClientInitializationError, 
  PrismaClientValidationError
} from "../generated/prisma/internal/prismaNamespace";
import { MulterError } from "multer";
import logger from "../winston/winston";

export class CustomError extends Error {
  public status: number;
  public code: string | undefined;

  constructor (message = 'Internal Server Error', status = 500, code?: string) {
    super(message); // chama o construtor da classe erro, ex: throw new Error('testando');
    this.name = this.constructor.name; // err.name vai vir o nome, nesse caso CustomErrors
    this.status = status; // adiciona um .status no err
    this.code = code;
    Error.captureStackTrace(this, this.constructor); // limpa a stack, meio inútil mas é bom ter
  }
}

function parseZodError(err: any) {
  return err.errors.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message
  }));
}

export function errorHandler (err: any, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const fields = parseZodError(err);
    req.logger.warning('Erro de validação', {
      event: 'validation_error',
      body: req.body,
      error: fields,
      actor: {
        userId: req.user,
        tenantId: req.tenant
      }
    });
    return res.status(400).json({ error: fields, code: ErrorCode.VALIDATION_ERROR });
  }

  if (
    err instanceof PrismaClientInitializationError ||
    err instanceof PrismaClientKnownRequestError ||
    err instanceof PrismaClientUnknownRequestError ||
    err instanceof PrismaClientValidationError
  ) {
    req.logger.crit(err.message, {
      event: 'prisma_error',
      body: req.body,
      error: err,
      stack: err.stack,
      actor: {
        userId: req.user,
        tenantId: req.tenant
      }
    })
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  if (err instanceof MulterError) {
    req.logger.warning(err.message, {
      event: 'multer_error',
      body: req.body,
      file: req.file,
      error: err,
      stack: err.stack,
      actor: {
        userId: req.user,
        tenantId: req.tenant
      }
    });
    return res.status(400).json({ error: err.message, code: err.code });
  }

  if (err instanceof CustomError) {
    req.logger.warning(err.message, {
      event: 'api_error',
      body: req.body,
      error: err,
      stack: err.stack,
      actor: {
        userId: req.user,
        tenantId: req.tenant
      }
    });
    return res.status(err.status).json({ error: err.message, code: err.code });
  }
  
  logger.error(err.message ?? 'Erro desconhecido', {
    stack: err.stack,
    code: err.code,
    status: err.status,
    actor: {
      userId: req.user,
      tenantId: req.tenant
    }
  })
  res.status(500).json({ error: 'Internal Server Error' });
}