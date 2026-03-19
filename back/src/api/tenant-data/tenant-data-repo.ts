import { PrismaClient } from "../../generated/prisma/client";
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { TenantReportDTO } from "./dto/tenant-reports-dto";
import { OrdersData } from "./entities/orders-data";
import { TenantData } from "./entities/tenant-data-entitie";
import { TenantDataStrDTO } from "./dto/tenant-data-dto";

export interface ITenantDataRepository {
  getData (tenantId: string): Promise<TenantData | null>;
  getOrdersData (tenantId: string, dates: TenantReportDTO): Promise<OrdersData[] | []>;
  patchData (tenantId: string, data: TenantDataStrDTO): Promise<TenantData | null>;
  addLogo (tenantId: string, cloudinaryImageUrl: string): Promise<void>;
  addBanner (tenantId: string, cloudinaryBannerUrl: string): Promise<void>;
}

const prisma = new PrismaClient();

export class TenantDataRepository implements ITenantDataRepository {
  async getData (tenantId: string) {
    return prisma.tenant.findUnique({
      where: {
        id: tenantId
      },
      select: {
        endereco: true,
        numero: true,
        complemento: true,
        bairro: true,
        municipio: true,
        estado: true,
        whatsapp: true,
        diasFuncionamento: true,
        horarioFuncionamento: true,
        tempoPreparo: true,
        pin: true
      }
    });
  }
  // por agora não é um problema mas otimizar isso no futuro
  // porque um tenant pode ter 10 mil pedidos e isso vai gargalar
  async getOrdersData (tenantSlug: string, dates: TenantReportDTO) {
    // o - 1 é porque o mês é 0 indexed
    const startOfMonth = new Date(dates.year, dates.month - 1, 1);
    const endOfMonth = new Date(dates.year, dates.month, 1);

    return prisma.pedidos.findMany({
      where: {
        tenantSlug: tenantSlug,
        status: dates.status,
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth
        }
      },
      select: {
        formaPagamento: true,
        taxaEntrega: true,
        tipoEntrega: true,
        totalOrderPrice: true,
        endereco: true,
        nomeCompleto: true,
        pedidosItens: {
          select: {
            nomeProduto: true,
            quantidade: true,
            precoProduto: true,
            subTotal: true,
            imageUrl: true,
            itensAdicionais: {
              select: {
                nomeProduto: true,
                precoProduto: true
              }
            }
          },
        },
      }
    });
  }

  async patchData (tenantId: string, data: TenantDataStrDTO) {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId
      }
    });

    if (!tenant) {
      throw new CustomError('Tenant não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    if (tenant.pin && tenant.pin !== data.pin) {
      throw new CustomError('Pin já foi cadastrado', 400, ErrorCode.BAD_REQUEST);
    }
    
    return prisma.tenant.update({
      where: {
        id: tenantId
      },
      data: data,
      select: {
        endereco: true,
        numero: true,
        complemento: true,
        bairro: true,
        municipio: true,
        estado: true,
        whatsapp: true,
        diasFuncionamento: true,
        horarioFuncionamento: true,
        tempoPreparo: true,
        pin: true
      }
    });
  }

  async addLogo (tenantId: string, cloudinaryImageUrl: string) {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId
      }
    });

    if (!tenant) {
      throw new CustomError('Tenant não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    await prisma.tenant.update({
      where: {
        id: tenantId
      },
      data: {
        logoUrl: cloudinaryImageUrl
      },
    });

    return;
  }

  async addBanner (tenantId: string, cloudinaryBannerUrl: string) {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId
      }
    });

    if (!tenant) {
      throw new CustomError('Tenant não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    await prisma.tenant.update({
      where: {
        id: tenantId
      },
      data: {
        bannerUrl: cloudinaryBannerUrl
      },
    });

    return;
  }
}