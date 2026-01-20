import { PrismaClient } from "../../generated/prisma/client";
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";

const prisma = new PrismaClient();

export class TenantHomeRepository {
  async getHomeData (tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId
      },
      select: {
        nomeRepresentante: true,
        trial: true,
        assinaturas: {
          where: {
            status: 'active'
          },
          select: {
            planType: true,
            endDate: true
          }
        }
      },
    });

    if (!tenant) {
      throw new CustomError('Tenant não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    return tenant;
  }

  async getHomeOrders (tenantSlug: string) {
    const now = new Date().getTime();
    const MINUS_TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    const pastTwentyFour = new Date(now - MINUS_TWENTY_FOUR_HOURS);
    const rightNow = new Date()

    return prisma.pedidos.findMany({
      where: {
        tenantSlug: tenantSlug,
        createdAt: {
          gte: pastTwentyFour,
          lte: rightNow
        },
        status: "concluido"
      },
      select: {
        totalOrderPrice: true
      }
    })
  }
}