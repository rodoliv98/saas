import { FlavorDTO, FlavorHasImage } from "../controllers/tenantFlavorsController";
import { uploadToCloudinary } from "./uploadToCloudinary";

export async function attachDefaultImage (imagePath: string | undefined, body: FlavorHasImage): Promise<FlavorDTO> {
  if (imagePath) {
    const imageUrl = await uploadToCloudinary(imagePath);
    const data = { ...body, imageUrl: imageUrl };
    
    return data;
  
  } else {
    const data = { ...body, imageUrl: process.env.DEFAULT_IMAGE! };
    
    return data;
  
  }
}