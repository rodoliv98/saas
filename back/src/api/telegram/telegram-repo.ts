import { PrismaClient } from "../../generated/prisma/client";
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { RegisterDeliveryManDTO } from "./dto/delivery-dtos";
import { UpdateDeliveryDTO } from "./dto/delivery-dtos";
import { OrdersDelivery } from "./intities/order-entities"
import { ActivationCode } from "./intities/code-entities";
import { DeliveryMan, DeliveryUpdate } from "./intities/delivery-entities";

export interface ITelegramRepo {
  getOrders(pin: string): Promise<OrdersDelivery[] | [] | null>;
  updateDeliveryOrder(updateObj: UpdateDeliveryDTO): Promise<DeliveryUpdate>;
  findDeliveryMan(pin: string, chat_id: bigint): Promise<DeliveryMan | null>;
  findActivationCode(activationCode: string): Promise<ActivationCode | null>; 
  registerDeliveryMan(data: RegisterDeliveryManDTO): Promise<void>;
}

export class TelegramRepo implements ITelegramRepo {
  constructor (private readonly prisma: PrismaClient) {}
  
  async getOrders (pin: string) {
    return this.prisma.pedidos.findMany({
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
    const order = await this.prisma.pedidos.findUnique({
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

    const updated = await this.prisma.pedidos.update({
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
    return this.prisma.tenant.findUnique({
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
    return this.prisma.codigos_Ativacao.findUnique({
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
    await this.prisma.entregadores.create({
      data: {
        chat_id: data.chat_id,
        nome_telegram: data.nome_telegram,
        codigo_ativ_usado: data.codigo_ativacao,
        tenant_id: data.tenant_id
      }
    });

    await this.prisma.codigos_Ativacao.update({
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