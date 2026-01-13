import multer from "multer"
import path from 'path'
import crypto from 'crypto'
import { CustomError } from "../src/middlewares/errorHandler";

const storage = multer.diskStorage({
  filename(req, file, cb) {
    const uniqueName = formatFileName(file.originalname);
    cb(null, uniqueName);
  }
});

function formatFileName (originalName: string) {
  const base = path.basename(originalName);
  const safe = base.replace(/[<>\[\]()!@&*%]/g, '_');
  const uniqueName = `${Date.now()}-${crypto.randomBytes(10).toString('hex')}${safe}`;

  return uniqueName;
}

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = ['image/jpeg','image/jpg','image/png','image/webp'];

    if (!allowedMime.includes(file.mimetype)) {
      const error = new CustomError('Formato de imagem inválido, use jpg, jpeg, png ou webp', 400, 'BAD_REQUEST') as any;
      return cb(error, false);
    }

    const allowedExts = ['.jpg','.jpeg','.png','.webp'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (!allowedExts.includes(fileExt)) {
      const error = new CustomError('Extensão não permitida, use jpg, jpeg, png ou webp', 400, 'BAD_REQUEST') as any;
      return cb(error, false);
    }

    cb(null, true);
  }
})