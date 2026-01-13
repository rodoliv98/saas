import { FlavorHasImage, IFlavor } from "../controllers/tenantFlavorsController";
import { Cuid } from "../types/types-index";
import { CustomError } from "../middlewares/errorHandler";
import { ITenantFlavorsRepository } from "../repository/tenantFlavorsRepository";
import { attachDefaultImage } from "../utils/attachDefaultImage";
import { ErrorCode } from "../types/constants/error-codes-constants";

export interface ITenantFlavorsService {
  getFlavors (productId: string): Promise<IFlavor[] | []>;
  getFlavorById (flavorId: string, tenantId: string): Promise<IFlavor>;
  create (productId: Cuid, imagePath: string | undefined, body: FlavorHasImage, tenantId: string): Promise<IFlavor>;
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

  async create (productId: Cuid, imagePath: string | undefined, body: FlavorHasImage, tenantId: string) {
    const data = await attachDefaultImage(imagePath, body);
    const flavor = await this.repo.create(data, productId, tenantId);

    return flavor;
  }

  async delete (productId: Cuid, tenantId: string) {
    await this.repo.delete(productId, tenantId);
    return;
  }
}