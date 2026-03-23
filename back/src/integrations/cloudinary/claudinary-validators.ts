import { validateMIMEType } from 'validate-image-type';
import { CustomError } from '../../middlewares/errorHandler';
import { ErrorCode } from '../../types/constants/error-codes-constants';

export async function validateImage(filePath: string) {
  if (!filePath) {
    throw new CustomError('Nenhum arquivo fornecido', 400, ErrorCode.BAD_REQUEST);
  }

  const validationResult = await validateMIMEType(filePath, {
    allowMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  });

  if (!validationResult.ok) {
    throw new CustomError('Validação da imagem falhou', 400, ErrorCode.BAD_REQUEST);
  }
}