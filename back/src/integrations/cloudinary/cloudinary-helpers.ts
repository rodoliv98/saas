import { v2 as cloudinary } from 'cloudinary';
import { ErrorCode } from '../../types/constants/error-codes-constants';
import { CustomError } from '../../middlewares/errorHandler';
import { CloudinaryImageResult } from './cloudinary-types';

export async function uploadImageCloudinary(filePath: string, tenantSlug: string): Promise<CloudinaryImageResult> {
  const result = await cloudinary.uploader.upload(filePath, {
    quality: 'auto',
    format: 'webp',
    width: 800,
    crop: 'scale',
    strip_profile: true,
    asset_folder: process.env.NODE_ENV === 'production'
    ? tenantSlug
    : 'dev',
    use_asset_folder_as_public_id_prefix: true
  }).catch((err) => {
    console.log(err);
    throw new CustomError('Erro ao fazer upload da imagem', 502, ErrorCode.BAD_GATEWAY);
  });
  
  const optimizedUrl = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
  
  return {
    public_id: result.public_id,
    url: optimizedUrl
  };
}

export async function deleteFromCloudinary(publicId: string) {
  await cloudinary.uploader.destroy(publicId).catch((err) => {
    console.log('Erro ao deletar imagem:', err);
    throw new CustomError('Erro ao deletar imagem', 502, ErrorCode.BAD_GATEWAY);
  });
}