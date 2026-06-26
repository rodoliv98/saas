import { FormatUserData } from "../../interfaces/users-interfaces/user-inter-index";
import { CustomError } from "../../errors/errorHandler";
import { IUserDataRepository } from "./user-data-repo";
import { UserAndItsRelations } from "./entities/user-entities";
import { ErrorCode } from "../../types/constants/error-codes-constants";

export interface IUserDataService {
  getData (userId: string): Promise<FormatUserData>;
} 

export class UserDataService implements IUserDataService {
  constructor (private repo: IUserDataRepository) {}
  
  async getData (userId: string): Promise<FormatUserData> {
    const data = await this.repo.getData(userId);
    if (!data) {
      throw new CustomError('Usuário não encontrado', 404, ErrorCode.USER_NOT_FOUND);
    }

    const user = this.formatUserData(data);
    return user;
  }

  private formatUserData (data: UserAndItsRelations): FormatUserData {
    return {
      user: {
        nomeCompleto: data.nomeCompleto,
        email: data.email
      },
      pedidos: data.pedidos.map(pedido => ({
        id: pedido.id,
        endereco: pedido.endereco,
        bairro: pedido.bairro,
        cep: pedido.cep,
        numero: pedido.numero,
        complemento: pedido.complemento,
        whatsapp: pedido.whatsapp,
        formaPagamento: pedido.formaPagamento,
        tipoEntrega: pedido.tipoEntrega,
        taxaEntrega: Number(pedido.taxaEntrega),
        totalOrderPrice: Number(pedido.totalOrderPrice),
        observacao: pedido.observacao,
        status: pedido.status,
        pedidosItens: pedido.pedidosItens.map(item => ({
          nomeProduto: item.nomeProduto,
          descProduto: item.descProduto,
          quantidade: item.quantidade,
          precoProduto: Number(item.precoProduto),
          subTotal: Number(item.subTotal),
          imageUrl: item.imageUrl,
          itensAdicionais: item.itensAdicionais.map(ads => ({
            nomeProduto: ads.nomeProduto,
            descProduto: ads.descProduto,
            precoProduto: Number(ads.precoProduto)
          }))
        }))
      }))
    }
  }
}