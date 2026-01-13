import { v2 as cloudinary } from 'cloudinary';
import { validateMIMEType } from 'validate-image-type';
import { CustomError } from '../middlewares/errorHandler';

export async function uploadToCloudinary(filePath: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (!filePath) return reject(new CustomError('Nenhum arquivo fornecido', 400, 'BAD_REQUEST'));

    const validationResult = await validateMIMEType(filePath, {
      allowMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    });

    if (!validationResult.ok) return reject(new CustomError('Validação da imagem falhou', 502, 'BAD_GATEWAY')); // checar isso depois. provavelmente inutil.

    cloudinary.uploader.upload(
      filePath,
      {
        quality: 'auto',
        format: 'webp',
        width: 800,
        crop: 'scale',
        strip_profile: true
      },
      function (err: any, result: any) {
        if (err) {
          console.log(err);
          return reject(new CustomError('Erro ao fazer upload da imagem', 502, 'BAD_GATEWAY'));
        }

        const optimizedUrl = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
        resolve(optimizedUrl);
      }
    );
  });
}