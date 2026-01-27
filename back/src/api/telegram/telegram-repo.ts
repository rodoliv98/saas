import { PrismaClient } from "../../generated/prisma/client";
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { RegisterDeliveryManDTO } from "../../types/dtos/delivery-register-dto";
import { UpdateDeliveryDTO } from "../../types/dtos/delivery-update-dto";
import { OrdersDelivery } from "../../types/entities/orders-data";
import { ActivationCode } from "./intities/code-entities";
import { DeliveryMan, DeliveryUpdate } from "./intities/delivery-entities";

const prisma = new PrismaClient();

export interface ITelegramRepo {
  getOrders(pin: string): Promise<OrdersDelivery[] | [] | null>; // feito
  updateDeliveryOrder(updateObj: UpdateDeliveryDTO): Promise<DeliveryUpdate>; // feito
  findDeliveryMan(pin: string, chat_id: bigint): Promise<DeliveryMan | null>; // feito
  findActivationCode(activationCode: string): Promise<ActivationCode | null>; // feito
  registerDeliveryMan(data: RegisterDeliveryManDTO): Promise<void>;
}

export class TelegramRepo implements ITelegramRepo {
  async getOrders (pin: string) {
    return prisma.pedidos.findMany({
      where: {
        pin,
        status: 'pronto'
      },
      select: {
        short_id: true,
        nomeCompleto: true,
        endereco: true,
        bairro: true,
        numero: true,
        complemento: true,
        formaPagamento: true,
        totalOrderPrice: true,
        pedidosItens: {
          select: {
            nomeProduto: true,
            quantidade: true,
            itensAdicionais: {
              select: {
                nomeProduto: true,
              }
            }
          }
        }
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
      select: {
        entregadores: {
          where: { chat_id },
          select: {
            id: true,
          }
        }
      }
    });
  }

  async findActivationCode (activationCode: string): Promise<ActivationCode | null> {
    return prisma.codigos_Ativacao.findUnique({
      where: {
        codigo: activationCode
      },
      select: {
        expire_date: true,
        utilizado: true,
        codigo: true,
        tenant_id: true
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