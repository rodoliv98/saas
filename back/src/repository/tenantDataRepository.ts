import { PrismaClient } from "../generated/prisma/client"
import { ITenantData } from "../controllers/tenantStoreController";
import { CustomError } from "../middlewares/errorHandler";
import { ErrorCode } from "../types/constants/error-codes-constants";
import { OrderReportDTO } from "../types/dtos/order-reports-dto";
import { OrdersData } from "../types/entities/orders-data";

interface PatchTenantFromService {
  diasFuncionamento: string; // <- service faz stringfy nisso aqui
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: string;
  estado: string;
  whatsapp: string;
  horarioFuncionamento: string;
  tempoPreparo: string;
  pin: string;
}

export interface ITenantDataRepository {
  getData (tenantId: string): Promise<ITenantData | null>
  getOrdersData (tenantId: string, dates: OrderReportDTO): Promise<OrdersData[] | []>;
  patchData (tenantId: string, data: PatchTenantFromService): Promise<ITenantData | null>
}

const prisma = new PrismaClient();

export class TenantDataRepository implements ITenantDataRepository {
  async getData (tenantId: string) {
    return prisma.tenant.findUnique({
      where: {
        id: tenantId
      }
    });
  }
  // por agora não é um problema mas otimizar isso no futuro
  // porque um tenant pode ter 10 mil pedidos e isso vai gargalar
  async getOrdersData (tenantSlug: string, dates: OrderReportDTO) {
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

  async patchData (tenantId: string, data: PatchTenantFromService) {
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
      data: data
    });
  }
}