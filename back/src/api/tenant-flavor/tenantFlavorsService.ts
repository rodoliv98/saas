import { Flavor } from "./entitie/flavor-entitie";
import { Cuid } from "../../types/types-index";
import { CustomError } from "../../errors/errorHandler";
import { ITenantFlavorsRepository } from "./tenantFlavorsRepository";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { CreateFlavorDTO, PatchFlavorDTO } from "./dto/tenant-flavor-dto";
import { uploadToCloudinary } from "../../integrations/cloudinary/cloudinary-upload";

export interface ITenantFlavorsService {
  getFlavors (productId: string): Promise<Flavor[] | []>;
  getFlavorById (flavorId: string, tenantId: string): Promise<Flavor>;
  create (flavorData: CreateFlavorDTO): Promise<Flavor>;
  patch (data: PatchFlavorDTO): Promise<void>;
  delete (flavorId: Cuid, tenantId: string): Promise<void>;
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
    const imageData = await this.resolveCreateImage(flavorData); 
    return this.repo.create({
      ...flavorData.data,
      tenantId: flavorData.tenantId,
      productId: flavorData.productId,
      imagePublicId: imageData.imagePublicId,
      imageUrl: imageData.imageUrl
    });
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

  async delete (flavorId: Cuid, tenantId: string) {
    const flavor = await this.repo.getFlavorById(flavorId, tenantId)
    if (!flavor) {
      throw new CustomError('Sabor não encontrado', 404, ErrorCode.FLAVOR_NOT_FOUND);
    }

    await this.repo.delete(flavorId, tenantId);
    return;
  }

  private async resolveCreateImage (flavorData: CreateFlavorDTO) {
    if (flavorData.multerImagePath) {
      const cloudinaryData = await uploadToCloudinary(
        flavorData.multerImagePath, 
        null, 
        flavorData.tenantSlug
      );

      return {
        imagePublicId: cloudinaryData.public_id,
        imageUrl: cloudinaryData.url
      }
    }

    return {
      imagePublicId: null,
      imageUrl: this.getDefaultImage()
    }
  }

  private getDefaultImage () {
    const defaultImage = process.env.NODE_ENV === 'production'
    ? process.env.PROD_DEFAULT_IMAGE
    : process.env.DEFAULT_IMAGE
    
    if (!defaultImage) {
      throw new CustomError('Imagem padrão não configurada', 500, ErrorCode.INTERNAL_SERVER_ERROR);
    }

    return defaultImage;
  }
}