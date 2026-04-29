import { Decimal } from "@prisma/client/runtime/library";
import { PrismaClient } from "../generated/prisma/client";
import { PedidoStatus } from "../types/types-index";

export interface UserDataFromDB {
  id: string;
  nomeCompleto: string;
  email: string;
  senha: string;
  pedidos: {
    id: string;
    tenantSlug: string;
    userId: string;
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
        itens_dos_pedidos: string;
        nomeProduto: string;
        descProduto: string;
        categoria: string;
        precoProduto: Decimal
      }[]
    }[]
  }[];
}

export interface IUserDataRepository {
  getData (userId: string): Promise<UserDataFromDB | null>;
}

export class UserDataRepository implements IUserDataRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async getData (userId: string) {
    return this.prisma.users.findFirst({
      where: {
        id: userId
      },
      include: {
        pedidos: {
          include: {
            pedidosItens: {
              include: {
                itensAdicionais: true
              }
            }
          }
        }
      }
    });
  }
}