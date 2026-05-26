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
import logger from "../lib/winston/winston";
import { handleZodError } from "./zod-error";
import { handleMulterError } from "./multer-error";
import { handleCustomError } from "./custom-error";

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

function sanitizeBody(body: any) {
  return {
    ...body,
    senha: 'censored'
  }
}

export function logData(req: Request, extra: Record<string, unknown> = {}) {
  return {
    body: sanitizeBody(req.body),
    actor: { userId: req.user, tenantId: req.tenant },
    ...extra
  }
}

export function createErrorObject(err: any) {
  return {
    code: err.code,
    name: err.name,
    stack: err.stack,
    status: err.status
  }
}

export function errorHandler (err: any, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return handleZodError(err, req, res);
  }

  if (err instanceof MulterError) {
    return handleMulterError(err, req, res);
  }

  if (err instanceof CustomError) {
    return handleCustomError(err, req, res);
  }

  const prismaErrObj = {
    message: err.message,
    code: ErrorCode.PRISMA_ERROR,
    body: {
      ...req.body,
      senha: 'censored'
    },
    error: err,
    stack: err.stack,
    actor: {
      userId: req.user,
      tenantId: req.tenant
    }
  }

  if (err instanceof PrismaClientInitializationError) {
    req.logger.emerg('PrismaClientInitializationError', prismaErrObj);
    return res.status(500).json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_SERVER_ERROR });
  } else if (err instanceof PrismaClientKnownRequestError) {
    req.logger.alert('PrismaClientKnownRequestError', { ...prismaErrObj, meta: err.meta });
    return res.status(500).json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_SERVER_ERROR });
  } else if (err instanceof PrismaClientUnknownRequestError) {
    req.logger.alert('PrismaClientUnknownRequestError', prismaErrObj);
    return res.status(500).json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_SERVER_ERROR });
  } else if (err instanceof PrismaClientValidationError) {
    req.logger.alert('PrismaClientValidationError', prismaErrObj);
    return res.status(500).json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_SERVER_ERROR });
  }
  
  logger.alert(err.message ?? 'Erro desconhecido', {
    ...createErrorObject(err),
    ...logData(req)
  })
  res.status(500).json({ error: 'Internal Server Error' });
}