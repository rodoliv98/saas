import { CloudinaryImageResult } from './cloudinary-types';
import { uploadImageCloudinary, deleteFromCloudinary } from './cloudinary-helpers';
import fs from 'fs/promises';

export async function uploadToCloudinary(
  filePath: string,
  publicId: string | null,
  tenantSlug: string
): Promise<CloudinaryImageResult> {
  if (publicId) {
    await deleteFromCloudinary(publicId);
  }

  const imageData = await uploadImageCloudinary(
    filePath, 
    tenantSlug
  );
  await fs.unlink(filePath);

  return imageData;
}