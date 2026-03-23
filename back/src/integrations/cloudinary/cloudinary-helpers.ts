import { v2 as cloudinary } from 'cloudinary';
import { ErrorCode } from '../../types/constants/error-codes-constants';
import { CustomError } from '../../middlewares/errorHandler';
import { CloudinaryImageResult } from './cloudinary-types';

export async function uploadImageCloudinary(filePath: string): Promise<CloudinaryImageResult> {
  const result = await cloudinary.uploader.upload(filePath, {
    quality: 'auto',
    format: 'webp',
    width: 800,
    crop: 'scale',
    strip_profile: true
  }).catch((err) => {
    console.log(err);
    throw new CustomError('Erro ao fazer upload da imagem', 502, ErrorCode.BAD_GATEWAY);
  });
  cloudinary.uploader.destroy
  console.log('Upload bem-sucedido:', result);

  const optimizedUrl = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
  const imageData = {
    public_id: result.public_id,
    url: optimizedUrl
  }
  
  return imageData;
}

export async function deleteFromCloudinary(publicId: string) {
  await cloudinary.uploader.destroy(publicId).catch((err) => {
    console.log('Erro ao deletar imagem:', err);
    throw new CustomError('Erro ao deletar imagem', 502, ErrorCode.BAD_GATEWAY);
  });
}