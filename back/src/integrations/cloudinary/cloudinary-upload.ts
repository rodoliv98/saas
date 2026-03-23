import { CloudinaryImageResult } from './cloudinary-types';
import { uploadImageCloudinary, deleteFromCloudinary } from './cloudinary-helpers';
import { validateImage } from './claudinary-validators';

export async function uploadToCloudinary(filePath: string, publicId: string | null): Promise<CloudinaryImageResult> {
  if (publicId) {
    await deleteFromCloudinary(publicId);
  }

  validateImage(filePath);

  return await uploadImageCloudinary(filePath);
}