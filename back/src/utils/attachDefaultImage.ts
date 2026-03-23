import { FlavorDTO, FlavorHasImage } from "../controllers/tenantFlavorsController";
import { uploadToCloudinary } from "../integrations/cloudinary/cloudinary-upload";

export async function attachDefaultImage (imagePath: string | undefined, body: FlavorHasImage): Promise<FlavorDTO> {
  if (imagePath) {
    const cloudinaryData = await uploadToCloudinary(imagePath, null);
    const data = { ...body, imageUrl: cloudinaryData.url };
    
    return data;
  
  } else {
    const data = { ...body, imageUrl: process.env.DEFAULT_IMAGE! };
    
    return data;
  
  }
}