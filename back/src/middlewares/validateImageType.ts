import { NextFunction, Request, Response } from 'express';
import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';

const ALLOWED_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export async function validateImageType(req: Request, res: Response, next: NextFunction) {
  const filePath = req.file?.path;

  if (filePath) {
    const detected = await fileTypeFromFile(filePath);

    if (!detected || !ALLOWED_TYPES.includes(detected.mime)) {
      await fs.unlink(filePath);
      return res.status(400).json({ error: `Tipo inválido: ${detected?.mime ?? 'desconhecido'}` });
    }

    return next();
  }

  next();
}
