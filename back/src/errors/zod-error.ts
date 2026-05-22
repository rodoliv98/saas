import { ZodError } from "zod";
import { Request, Response } from "express";
import { ErrorCode } from "../types/constants/error-codes-constants";
import { logData } from "./errorHandler";

function parseZodError(err: any) {
  return err.errors.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message
  }));
}

export function handleZodError(err: ZodError, req: Request, res: Response) {
  const fields = parseZodError(err);
  req.logger.warning('Erro de validação', {
    ...logData(req, { code: ErrorCode.VALIDATION_ERROR, error: fields })
  });
  return res.status(400).json({ error: fields, code: ErrorCode.VALIDATION_ERROR });
}
