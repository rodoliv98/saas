import { IPatchProductDTO } from "../controllers/tenantProductsController";
import { uploadToCloudinary } from "./uploadToCloudinary";

export async function checkIfHasImage (imageUrl: string | undefined, body: IPatchProductDTO) {
    if (imageUrl) {
        const url = await uploadToCloudinary(imageUrl);
        const data = { ...body, imageUrl: url };
        return data;
    } else {
        return body;
    }
}