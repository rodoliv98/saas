import { PedidoStatus } from "../../types/types-index";
import { OrderSchema } from "./types/order-types";
import { Cuid } from "../../types/types-index";
import { ICreateOrder, IOrderRepository } from "./ordersRepository";
import { Decimal } from "../../generated/prisma/internal/prismaNamespace";
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { customAlphabet } from "nanoid";
import { Orders } from "./entities/order-entitie";

export interface IOrdersService {
  getOrders (tenantSlug: string): Promise<Orders[] | []>;
  patchOrders (orderId: Cuid, body: PedidoStatus, tenantSlug: string): Promise<ICreateOrder>;
  create (body: OrderSchema, userId: string): Promise<ICreateOrder>;
} 

export class OrdersService implements IOrdersService {
  constructor (private repo: IOrderRepository) {}
  
  async getOrders (tenantSlug: string): Promise<Orders[] | []> {
    return this.repo.getOrders(tenantSlug);
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
    const itemsIds = body.items.map(item => 
      Array.from({ length: item.quantidade }, () => 
        item.id)
    ).flat();

    const aditionalIds = body.items.map(item => 
      Array.from({ length: item.quantidade }, () => 
        item.adicionais.map(ads => ads.id))
    ).flat(2);

    const [productsPrices, aditionalsPrices] = await Promise.all([
      this.repo.getProductsPrice(itemsIds),
      this.repo.getAditionalsPrice(aditionalIds)
    ]);
    const allPrices = productsPrices.concat(aditionalsPrices);
    // return aqui pq se não o erro estora e quebra a aplicação
    return this.checkIfPricesMatch(allPrices, body.totalOrderPrice, body.taxaEntrega);
  }

  async checkIfPricesMatch (dbPrices: Array<{precoProduto: Decimal}>, bodyTotal: number, taxaEntrega: number) {
    let sumInCents = 0;
    
    for (let i = 0; i < dbPrices.length; i++) {
      sumInCents += Math.round(Number(dbPrices[i].precoProduto) * 100);
    }
  
    const bodyWithFee = Math.round(bodyTotal * 100);
    const realBodyPrice = bodyWithFee - Math.round(taxaEntrega * 100);

    if (sumInCents !== realBodyPrice) {
      throw new CustomError('Preços não batem', 400, ErrorCode.BAD_REQUEST);
    }
  }
}