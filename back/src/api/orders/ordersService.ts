import { PedidoStatus } from "../../types/types-index";
import { OrderSchema } from "./types/order-types";
import { Cuid } from "../../types/types-index";
import { ICreateOrder, IOrderRepository, OrdersFromRepo } from "./ordersRepository";
import { checkIfPricesMatch } from "../../utils/checkIfPricesMatch";
import { IFormatGetOrdersData } from "../../interfaces/orders-interfaces/orders-inter-index";
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { customAlphabet } from "nanoid";

export interface IOrdersService {
  getOrders (tenantSlug: string): Promise<IFormatGetOrdersData[] | []>;
  patchOrders (orderId: Cuid, body: PedidoStatus, tenantSlug: string): Promise<ICreateOrder>;
  create (body: OrderSchema, userId: string): Promise<ICreateOrder>;
} 

export class OrdersService implements IOrdersService {
  constructor (private repo: IOrderRepository) {}
  
  async getOrders (tenantSlug: string): Promise<IFormatGetOrdersData[] | []> {
    const orders = await this.repo.getOrders(tenantSlug);
    const formattedOrders = this.formatGetOrdersData(orders);

    return formattedOrders;
  }

  async patchOrders (orderId: Cuid, body: PedidoStatus, tenantSlug: string) {
    return this.repo.patchOrders(orderId, body, tenantSlug);
  }
  // otimizar no futuro
  async create (body: OrderSchema, userId: string) {
    const [tenantPin, orders] = await Promise.all([
      this.repo.getTenantPin(body.tenantSlug),
      this.repo.getUserOrders(userId)
    ]);

    if (!tenantPin || !tenantPin.pin) {
      throw new CustomError('Pin não configurado', 404, ErrorCode.PIN_NOT_FOUND);
    }

    if (orders.length > 0) {
      console.log('hit');  
      throw new CustomError(
        'Você já tem um pedido em andamento, aguarde ele terminar para fazer outro',
        400,
        ErrorCode.ORDER_IN_PROGRESS
      );
    }

    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 6);
    const shortId = nanoid();

    await this.checkProductsPrices(body);
    return this.repo.create(body, userId, tenantPin.pin, shortId);
  }

  async checkProductsPrices (body: OrderSchema) {
    const itemsIds = body.items.map(item => item.id);
    const aditionalIds = body.items.flatMap(item => item.adicionais || [])
                                   .map(ads => ads.id);

    const [productsPrices, aditionalsPrices] = await Promise.all([
      this.repo.getProductsPrice(itemsIds),
      this.repo.getAditionalsPrice(aditionalIds)
    ]);
    const allPrices = productsPrices.concat(aditionalsPrices);

    checkIfPricesMatch(allPrices, body.totalOrderPrice, body.taxaEntrega);
  }

  private formatGetOrdersData (dataFromDb: OrdersFromRepo[]): IFormatGetOrdersData[] {
    return dataFromDb.map(data => ({
      id: data.id,
      nomeCompleto: data.nomeCompleto,
      endereco: data.endereco,
      bairro: data.bairro,
      cep: data.cep,
      numero: data.numero,
      complemento: data.complemento,
      whatsapp: data.whatsapp,
      formaPagamento: data.formaPagamento,
      tipoEntrega: data.tipoEntrega,
      taxaEntrega: Number(data.taxaEntrega),
      observacao: data.observacao,
      totalOrderPrice: Number(data.totalOrderPrice),
      status: data.status,
      pedidosItens: data.pedidosItens.map(item => ({
        nomeProduto: item.nomeProduto,
        descProduto: item.descProduto,
        categoria: item.categoria,
        quantidade: Number(item.quantidade),
        precoProduto: Number(item.precoProduto),
        totalPrice: Number(item.subTotal),
        imageUrl: item.imageUrl,
        adicionais: item.itensAdicionais.map(ad => ({
          nomeProduto: ad.nomeProduto,
          descProduto: ad.descProduto,
          categoria: ad.categoria,
          precoProduto: Number(ad.precoProduto)
        }))
      })),
    }))
  }
}