import { IPatchProductDTO } from "../controllers/tenantProductsController";
import { uploadToCloudinary } from "../integrations/cloudinary/cloudinary-upload";

export async function checkIfHasImage (imageUrl: string | undefined, body: IPatchProductDTO) {
    if (imageUrl) {
        const cloudinaryData = await uploadToCloudinary(imageUrl);
        const data = { ...body, imageUrl: cloudinaryData.url };
        return data;
    } else {
        return body;
    }
}