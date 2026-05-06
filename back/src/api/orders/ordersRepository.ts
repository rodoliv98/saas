import { Decimal } from "@prisma/client/runtime/library";
import { PedidosStatus, PrismaClient } from "../../generated/prisma/client";
import { PedidoStatus } from "../../types/types-index";
import { OrderSchema } from "./types/order-types";
import { Cuid } from "../../types/types-index";
import { CustomError } from "../../middlewares/errorHandler";
import { IGetUserOrders } from "../../interfaces/orders-interfaces/orders-inter-index";
import { Orders } from "./entities/order-entitie";

export interface PricesFromDB {
  precoProduto: Decimal
}

export interface ICreateOrder {
  id: string;
  tenantSlug: string;
  nomeCompleto: string;
  endereco: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento: string | null;
  whatsapp: string;
  formaPagamento: string;
  tipoEntrega: string;
  taxaEntrega: Decimal;
  totalOrderPrice: Decimal;
  observacao: string | null;
  status: PedidoStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrdersFromRepo {
  id: string;
  short_id: string | null;
  tenantSlug: string;
  nomeCompleto: string;
  endereco: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento: string | null;
  whatsapp: string;
  formaPagamento: string;
  tipoEntrega: string;
  taxaEntrega: Decimal;
  totalOrderPrice: Decimal;
  observacao: string | null;
  status: PedidoStatus;
  createdAt: Date;
  updatedAt: Date;
  pin: string | null;
  userId: string;
  pedidosItens: {
    id: string;
    produtoId: string;
    pedidosId: string;
    nomeProduto: string;
    descProduto: string;
    categoria: string;
    quantidade: number;
    precoProduto: Decimal;
    subTotal: Decimal;
    imageUrl: string;
    itensAdicionais: {
      id: string;
      nomeProduto: string;
      descProduto: string;
      precoProduto: Decimal;
      categoria: string;
      itens_dos_pedidos: string;
    }[];
  }[]
}

export interface IOrderRepository {
  getOrders (tenantSlug: string): Promise<Orders[] | []>;
  getTenantPin (tenantSlug: string): Promise<{ pin: string | null } | null>;
  getUserOrders (userId: string): Promise<IGetUserOrders[]>;
  patchOrders (orderId: Cuid, body: PedidoStatus, tenantSlug: string): Promise<ICreateOrder>;
  create (body: OrderSchema, userId: string, pin: string, shortId: string): Promise<ICreateOrder>;
  getProductsPrice (productsIds: string[]): Promise<PricesFromDB[] | []>;
  getAditionalsPrice (aditionalsIds: string[]): Promise<PricesFromDB[] | []>;
} 

export class OrderRepository implements IOrderRepository {
  constructor (private readonly prisma: PrismaClient) {}
  
  // modificado para totalOrderPrice ser number e não Decimal, para evitar problemas de serialização e facilitar o consumo no front-end. 
  // O valor é convertido para number antes de retornar os dados.
  async getOrders (tenantSlug: string): Promise<Orders[] | []> {
    const statusList: PedidosStatus[] = [
      PedidosStatus.pendente,
      PedidosStatus.preparando,
      PedidosStatus.pronto,
      PedidosStatus.entregando
    ]; 

    const orders = await this.prisma.pedidos.findMany({
      where: {
        tenantSlug: tenantSlug,
        status: { in: statusList } 
      },
      select: {
        id: true,
        nomeCompleto: true,
        tipoEntrega: true,
        totalOrderPrice: true,
        observacao: true,
        createdAt: true,
        status: true,
        pedidosItens: {
          select: {
            nomeProduto: true,
            descProduto: true,
            quantidade: true,
            itensAdicionais: {
              select: {
                nomeProduto: true,
                descProduto: true
              }
            }
          }
        }
      }
    });

    return orders.map(order => ({
      id: order.id,
      nomeCompleto: order.nomeCompleto,
      tipoEntrega: order.tipoEntrega,
      totalOrderPrice: Number(order.totalOrderPrice),
      observacao: order.observacao,
      createdAt: order.createdAt,
      status: order.status,
      pedidosItens: order.pedidosItens.map(item => ({
        nomeProduto: item.nomeProduto,
        descProduto: item.descProduto,
        quantidade: item.quantidade,
        itensAdicionais: item.itensAdicionais.map(ads => ({
          nomeProduto: ads.nomeProduto,
          descProduto: ads.descProduto
        }))
      }))
    }));
  }

  async getTenantPin (tenantSlug: string) {
    return this.prisma.tenant.findUnique({
      where: {
        tenantSlug: tenantSlug
      },
      select: {
        pin: true
      }
    });
  }

  async getUserOrders (userId: string) {
    const statusList: PedidosStatus[] = [
      PedidosStatus.pendente,
      PedidosStatus.preparando,
      PedidosStatus.pronto,
      PedidosStatus.entregando
    ];
    
    return this.prisma.pedidos.findMany({
      where: {
        userId: userId,
        status: { in: statusList } 
      },
    })
  }

  async patchOrders (orderId: Cuid, body: PedidoStatus, tenantSlug: string): Promise<ICreateOrder> {
    const order = await this.prisma.pedidos.findFirst({
      where: {
        tenantSlug: tenantSlug,
        id: orderId
      }
    });

    if (!order) {
      throw new CustomError('Pedido não encontrado', 404, 'ORDER_NOT_FOUND');
    }

    return await this.prisma.pedidos.update({
      where: {
        id: orderId
      },
      data: {
        status: body
      }
    })
  }
  
  async create (body: OrderSchema, userId: string, pin: string, shortId: string): Promise<ICreateOrder> {
    return this.prisma.pedidos.create({
      data: {
        tenantSlug: body.tenantSlug,
        pin: pin,
        userId: userId,
        nomeCompleto: body.nomeCompleto,
        endereco: body.endereco,
        bairro: body.bairro,
        cep: body.cep,
        numero: body.numero,
        complemento: body.complemento,
        whatsapp: body.whatsapp,
        formaPagamento: body.formaPagamento,
        tipoEntrega: body.tipoEntrega,
        taxaEntrega: body.taxaEntrega,
        observacao: body.observacao,
        totalOrderPrice: Number(body.totalOrderPrice),
        short_id: shortId,
        pedidosItens: {
          create: body.items.map(item => ({
            nomeProduto: item.nomeProduto,
            descProduto: item.descProduto,
            categoria: item.categoria,
            quantidade: Number(item.quantidade),
            precoProduto: Number(item.precoProduto),
            subTotal: Number(item.totalPrice),
            imageUrl: item.imageUrl,
            produtos: { connect: { id: item.id } },
            itensAdicionais: {
              createMany: {
                data: item.adicionais.map(ads => ({
                  nomeProduto: ads.nomeProduto,
                  descProduto: ads.descProduto,
                  categoria: ads.categoria,
                  precoProduto: Number(ads.precoProduto),
                }))
              } 
            }
          }))
        }
      }
    })
  }
  
  async getProductsPrice (productsIds: string[]) {
    const productsNoDups = await this.prisma.produtos.findMany({
      where: {
        id: { in: productsIds } // in = a set remove ids duplicados
      },
      select: {
        id: true,
        precoProduto: true
      }
    });
    
    const mapIds = new Map(productsNoDups.map(prod => [prod.id, prod.precoProduto]));
    return productsIds.map(id => ({ precoProduto: mapIds.get(id) }))
                      .filter(
                      (prod): prod is { precoProduto: Decimal } => // retorna isso
                        prod.precoProduto !== undefined // se true
                      );
  }

  async getAditionalsPrice (aditionalsIds: string[]) {
    const aditionalNoDups = await this.prisma.sabores.findMany({
      where: {
        id: { in: aditionalsIds } // in = a set remove ids duplicados
      },
      select: {
        id: true,
        precoProduto: true
      }
    })
    const mapIds = new Map(aditionalNoDups.map(item => [item.id, item.precoProduto]));
    return aditionalsIds.map(id => ({ precoProduto: mapIds.get(id) }))
                        .filter(
                          (prod): prod is { precoProduto: Decimal } => // retorna isso
                            prod.precoProduto !== undefined // se true
                        );
  }
}