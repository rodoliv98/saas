import { Request, Response } from "express";
import { createErrorObject, CustomError, logData } from "./errorHandler";

export function handleCustomError(err: CustomError, req: Request, res: Response) {
  req.logger.warning(err.message, {
    ...logData(req),
    ...createErrorObject(err)
  });
  return res.status(err.status).json({ error: err.message, code: err.code });
}