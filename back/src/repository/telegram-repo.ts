import { PrismaClient } from "../generated/prisma/client";
import { OrdersForDelivery } from "../interfaces/tenant-interfaces/tenant-inter-index";
import { CustomError } from "../middlewares/errorHandler";
import { ErrorCode } from "../types/constants/error-codes-constants";
import { RegisterDeliveryManDTO } from "../types/dtos/delivery-register-dto";
import { UpdateDeliveryDTO } from "../types/dtos/delivery-update-dto";

const prisma = new PrismaClient();

export class TelegramRepo {
  async getOrders (pin: string): Promise<OrdersForDelivery[]> {
    return prisma.pedidos.findMany({
      where: {
        pin,
        status: 'pronto'
      }
    })
  }

  async updateDeliveryOrder (updateObj: UpdateDeliveryDTO) {
    const order = await prisma.pedidos.findUnique({
      where: {
        short_id: updateObj.code
      }
    });

    if (!order) {
      throw new CustomError('Pedido não encontrado para atualização', 404, ErrorCode.DELIVERY_ERROR);
    }

    if (order.finished) {
      throw new CustomError('Você não pode mais atualizar esse pedido', 400, ErrorCode.DELIVERY_ERROR);
    }

    const updated = await prisma.pedidos.update({
      where: {
        short_id: updateObj.code
      },
      data: {
        status: updateObj.status,
        finished: true
      },
      select: {
        endereco: true,
        bairro: true,
        complemento: true,
        nomeCompleto: true,
        status: true
      }
    });

    return updated;
  }

  async findDeliveryMan (pin: string, chat_id: bigint) {
    return prisma.tenant.findUnique({
      where: { pin },
      include: {
        entregadores: {
          where: { chat_id }
        }
      }
    });
  }

  async findActivationCode (activationCode: string) {
    return prisma.codigos_Ativacao.findUnique({
      where: {
        codigo: activationCode
      }
    });
  }

  async registerDeliveryMan (data: RegisterDeliveryManDTO) {
    await prisma.entregadores.create({
      data: {
        chat_id: data.chat_id,
        nome_telegram: data.nome_telegram,
        codigo_ativ_usado: data.codigo_ativacao,
        tenant_id: data.tenant_id
      }
    });

    await prisma.codigos_Ativacao.update({
      where: {
        codigo: data.codigo_ativacao
      },
      data: {
        usado_em: new Date(),
        utilizado: true
      }
    });

    return;
  }
}