import { IFlavor } from "../controllers/tenantFlavorsController";
import { Cuid } from "../types/types-index";
import { CustomError } from "../middlewares/errorHandler";
import { ITenantFlavorsRepository } from "../repository/tenantFlavorsRepository";
import { ErrorCode } from "../types/constants/error-codes-constants";
import { CreateFlavorDTO, PatchFlavorDTO } from "../api/tenant-flavor/dto/tenant-flavor-dto";
import { uploadToCloudinary } from "../integrations/cloudinary/cloudinary-upload";

export interface ITenantFlavorsService {
  getFlavors (productId: string): Promise<IFlavor[] | []>;
  getFlavorById (flavorId: string, tenantId: string): Promise<IFlavor>;
  create (flavorData: CreateFlavorDTO): Promise<IFlavor>;
  patch (data: PatchFlavorDTO): Promise<void>;
  delete (productId: Cuid, tenantId: string): Promise<void>;
}

export class TenantFlavorsService implements ITenantFlavorsService {
  constructor (private repo: ITenantFlavorsRepository) {}

  async getFlavors (productId: string) {
    return this.repo.getFlavors(productId);
  }

  async getFlavorById (flavorId: string, tenantId: string) {
    const flavor = await this.repo.getFlavorById(flavorId, tenantId);
    if (!flavor) {
      throw new CustomError('Nenhum sabor encontrado', 404, ErrorCode.FLAVOR_NOT_FOUND);
    }

    return flavor;
  }

  async create (flavorData: CreateFlavorDTO) {
    if (flavorData.multerImagePath) {
      const cloudinaryData = await uploadToCloudinary(
        flavorData.multerImagePath, 
        null, 
        flavorData.tenantSlug
      );

      const createFlavorData = {
        ...flavorData.data,
        tenantId: flavorData.tenantId,
        productId: flavorData.productId,
        imagePublicId: cloudinaryData.public_id,
        imageUrl: cloudinaryData.url
      }

      const flavor = await this.repo.create(createFlavorData);
      return flavor;
    }

    const defaultImage = process.env.NODE_ENV === 'production'
    ? process.env.PROD_DEFAULT_IMAGE
    : process.env.DEFAULT_IMAGE
    
    if (!defaultImage) {
      throw new CustomError('Imagem padrão não configurada', 500, ErrorCode.INTERNAL_SERVER_ERROR);
    }

    const createFlavorData = {
      ...flavorData.data,
      tenantId: flavorData.tenantId,
      productId: flavorData.productId,
      imagePublicId: null,
      imageUrl: defaultImage
    }
    const flavor = await this.repo.create(createFlavorData);
    return flavor;
  }

  async patch (flavorData: PatchFlavorDTO) {
    const foundFlavor = await this.repo.findFlavor(flavorData);
    if (!foundFlavor) {
      throw new CustomError('Nenhum sabor encontrado para atualização', 404, ErrorCode.FLAVOR_NOT_FOUND);
    }

    if (!foundFlavor.imageUrl) {
      throw new CustomError('O sabor não possui uma imagem para ser atualizada', 400, ErrorCode.BAD_REQUEST);
    } 

    if (flavorData.multerImagePath) {
      const cloudinaryData = await uploadToCloudinary(
        flavorData.multerImagePath, 
        foundFlavor.imagePublicId, 
        flavorData.tenantSlug
      );
      const updateFlavorData = {
        ...flavorData.data,
        imagePublicId: cloudinaryData.public_id,
        imageUrl: cloudinaryData.url
      } 
      
      await this.repo.patch(updateFlavorData, flavorData.flavorId);
      return;
    }

    const updateFlavorData = {
      ...flavorData.data,
      imagePublicId: foundFlavor.imagePublicId,
      imageUrl: foundFlavor.imageUrl
    }

    await this.repo.patch(updateFlavorData, flavorData.flavorId);
    return;
  }

  async delete (productId: Cuid, tenantId: string) {
    await this.repo.delete(productId, tenantId);
    return;
  }
}