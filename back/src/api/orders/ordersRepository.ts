import { Decimal } from "@prisma/client/runtime/library";
import { PedidosStatus, PrismaClient } from "../../generated/prisma/client";
import { PedidoStatus } from "../../types/types-index";
import { OrderSchema } from "./types/order-types";
import { Cuid } from "../../types/types-index";
import { CustomError } from "../../middlewares/errorHandler";
import { IGetUserOrders } from "../../interfaces/orders-interfaces/orders-inter-index";

const prisma = new PrismaClient();

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
  getOrders (tenantSlug: string): Promise<OrdersFromRepo[]>;
  getTenantPin (tenantSlug: string): Promise<{ pin: string | null } | null>;
  getUserOrders (userId: string): Promise<IGetUserOrders[]>;
  patchOrders (orderId: Cuid, body: PedidoStatus, tenantSlug: string): Promise<ICreateOrder>;
  create (body: OrderSchema, userId: string, pin: string, shortId: string): Promise<ICreateOrder>;
  getProductsPrice (productsIds: string[]): Promise<PricesFromDB[]>;
  getAditionalsPrice (aditionalsIds: string[]): Promise<PricesFromDB[]>;
} 

export class OrderRepository implements IOrderRepository {
  // tem que otimizar tbm
  async getOrders (tenantSlug: string): Promise<OrdersFromRepo[]> {
    return prisma.pedidos.findMany({
      where: {
        tenantSlug: tenantSlug
      },
      include: {
        pedidosItens: {
          include: {
            itensAdicionais: true
          }
        }
      }
    });
  }

  async getTenantPin (tenantSlug: string) {
    return prisma.tenant.findUnique({
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
    
    return prisma.pedidos.findMany({
      where: {
        userId: userId,
        status: { in: statusList } 
      },
    })
  }

  async patchOrders (orderId: Cuid, body: PedidoStatus, tenantSlug: string): Promise<ICreateOrder> {
    const order = await prisma.pedidos.findFirst({
      where: {
        tenantSlug: tenantSlug,
        id: orderId
      }
    });

    if (!order) {
      throw new CustomError('Pedido não encontrado', 404, 'ORDER_NOT_FOUND');
    }

    return await prisma.pedidos.update({
      where: {
        id: orderId
      },
      data: {
        status: body
      }
    })
  }
  
  async create (body: OrderSchema, userId: string, pin: string, shortId: string): Promise<ICreateOrder> {
    return prisma.pedidos.create({
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
  
  async getProductsPrice (productsIds: string[]): Promise<PricesFromDB[]> {
    /*
      usa set aqui para remover duplicatas e não pesquisar
      o mesmo id no banco desnecessáriamente
    */
    const setIds = [...new Set(productsIds)];
    
    const productsPrices = await prisma.produtos.findMany({
      where: {
        id: { in: setIds }
      },
      select: {
        id: true,
        precoProduto: true
      }
    })
    // cria um map onde o id do produto é a Key e o precoProduto é o Value
    const mappedIds = new Map(productsPrices.map(p => [p.id, p.precoProduto]));
    /*
      retorna um objeto onde o valor de precoProduto
      vai ser o valor do id correspondente detro do map
      filter usa uma condição para limpar os undefineds
    */
    const prices = productsIds
      .map(ids => ({ precoProduto: mappedIds.get(ids) }))
      .filter(
        (prod): prod is { precoProduto: Decimal } => // retorna isso
          prod.precoProduto !== undefined // se true
      )

    return prices;
  }

  async getAditionalsPrice (aditionalsIds: string[]): Promise<PricesFromDB[]> {
    /*
      usa set aqui para remover duplicatas e não pesquisar
      o mesmo id no banco desnecessáriamente
    */
    const setIds = [...new Set(aditionalsIds)];
    
    const aditionalsPrices = await prisma.sabores.findMany({
      where: {
        id: { in: setIds }
      },
      select: {
        id: true,
        precoProduto: true
      }
    })
    // cria um map onde o id do produto é a Key e o precoProduto é o Value
    const mappedIds = new Map(aditionalsPrices.map(ads => [ads.id, ads.precoProduto]));
    /*
      retorna um objeto onde o valor de precoProduto
      vai ser o valor do id correspondente detro do map
      filter usa uma condição para limpar os undefineds
    */
    const prices = aditionalsIds
      .map(ids => ({ precoProduto: mappedIds.get(ids) }))
      .filter(
        (prod): prod is { precoProduto: Decimal } => // retorna isso
          prod.precoProduto !== undefined // se true
      )

    return prices;
  }
}