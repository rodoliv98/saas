import { Request, Response } from "express";
import { MulterError } from "multer";
import { createErrorObject, logData } from "./errorHandler";

export function handleMulterError(err: MulterError, req: Request, res: Response) {
  req.logger.warning(err.message, {
    ...logData(req, { file: req.file, }),
    ...createErrorObject(err)
  });
  return res.status(400).json({ error: err.message, code: err.code });
}
