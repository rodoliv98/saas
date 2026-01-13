import { PatchTenantType } from "../types/types-index";
import { CustomError } from "../middlewares/errorHandler";
import { ITenantDataRepository } from "../repository/tenantDataRepository";
import { IFormatTenantData } from "../interfaces/tenant-interfaces/tenant-inter-index";
import { ITenantData } from "../controllers/tenantStoreController";
import { ErrorCode } from "../types/constants/error-codes-constants";
import { OrderReportDTO } from "../types/dtos/order-reports-dto";
import { OrdersData } from "../types/entities/orders-data";

export interface ITenantDataService {
  getData (tenantId: string): Promise<IFormatTenantData>;
  getOrders (tenantSlug: string, dates: OrderReportDTO): Promise<OrdersData[] | []>;
  patchData (tenantId: string, data: PatchTenantType): Promise<IFormatTenantData>;
}

export class TenantDataService implements ITenantDataService {
  constructor (private repo: ITenantDataRepository) {}

  async getData (tenantId: string) {
    const tenant = await this.repo.getData(tenantId);
    if (!tenant) {
      throw new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    const tenantData = this.formatTenantData(tenant);
    return tenantData;
  }

  async getOrders (tenantSlug: string, dates: OrderReportDTO) {
    const orders = await this.repo.getOrdersData(tenantSlug, dates);
    return orders;
  }

  async patchData (tenantId: string, data: PatchTenantType) {
    const diasFunc = JSON.stringify(data.diasFuncionamento);
    const newData = { ...data, diasFuncionamento: diasFunc };

    const updatedData = await this.repo.patchData(tenantId, newData);
    if (updatedData == null) {
      throw new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    const tenantData = this.formatTenantData(updatedData);
    return tenantData;
  }

  private formatTenantData (data: ITenantData) {
    return {
      // passo 3
      endereco: data.endereco,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      municipio: data.municipio,
      estado: data.estado,
      // passo 4
      whatsapp: data.whatsapp,
      diasFuncionamento: data.diasFuncionamento,
      horarioFuncionamento: data.horarioFuncionamento,
      tempoPreparo: data.tempoPreparo,
      pin: data.pin,
      taxaEntrega: Number(data.taxaEntrega)
    }
  }
}