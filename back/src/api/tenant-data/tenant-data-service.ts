import { CustomError } from "../../middlewares/errorHandler";
import { ITenantDataRepository } from "./tenant-data-repo";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { TenantReportDTO } from "./dto/tenant-reports-dto";
import { OrdersData } from "./entities/orders-data";
import { TenantData } from "./entities/tenant-data-entitie";
import { TenantDataDTO } from "./dto/tenant-data-dto";
import { uploadToCloudinary } from "../../integrations/cloudinary/cloudinary-upload";

export interface ITenantDataService {
  getData (tenantId: string): Promise<TenantData>;
  getOrders (tenantSlug: string, dates: TenantReportDTO): Promise<OrdersData[] | []>;
  patchData (tenantId: string, data: TenantDataDTO): Promise<TenantData>;
  addLogo (tenantId: string, logoUrl: string): Promise<void>;
  addBanner (tenantId: string, bannerUrl: string): Promise<void>;
}

export class TenantDataService implements ITenantDataService {
  constructor (private repo: ITenantDataRepository) {}

  async getData (tenantId: string) {
    const tenant = await this.repo.getData(tenantId);
    if (!tenant) {
      throw new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    return tenant;
  }

  async getOrders (tenantSlug: string, dates: TenantReportDTO) {
    const orders = await this.repo.getOrdersData(tenantSlug, dates);
    return orders;
  }

  async patchData (tenantId: string, data: TenantDataDTO) {
    const diasFunc = JSON.stringify(data.diasFuncionamento);
    const newData = { ...data, diasFuncionamento: diasFunc };

    const updatedData = await this.repo.patchData(tenantId, newData);
    if (updatedData == null) {
      throw new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    return updatedData;
  }

  async addLogo (tenantId: string, logoUrl: string) {
    const publicId = await this.repo.getImagePublicId(tenantId);
    if (!publicId) {
      throw new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    const cloudinaryData = await uploadToCloudinary(logoUrl, publicId.logoPublicId);
    return this.repo.addLogo(tenantId, cloudinaryData);
  }

  async addBanner (tenantId: string, bannerUrl: string) {
    const publicId = await this.repo.getImagePublicId(tenantId);
    if (!publicId) {
      throw new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    const cloudinaryData = await uploadToCloudinary(bannerUrl, publicId.bannerPublicId);
    return this.repo.addBanner(tenantId, cloudinaryData);
  }
}