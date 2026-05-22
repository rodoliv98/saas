import { PedidoStatus } from "../../types/types-index";
import { OrderSchema } from "./types/order-types";
import { Cuid } from "../../types/types-index";
import { ICreateOrder, IOrderRepository, PricesFromDB } from "./ordersRepository";
import { Decimal } from "../../generated/prisma/internal/prismaNamespace";
import { CustomError } from "../../errors/errorHandler";
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
  // falta testar dps de tirar a call inutil extra
  async create (body: OrderSchema, userId: string) {
    const tenantPin = await this.repo.getTenantPin(body.tenantSlug)

    if (!tenantPin || !tenantPin.pin) {
      throw new CustomError('Pin não configurado', 404, ErrorCode.PIN_NOT_FOUND);
    }

    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(alphabet, 6);
    const shortId = nanoid();

    await this.findProductsPrices(body);
    return this.repo.create(body, userId, tenantPin.pin, shortId);
  }

  async findProductsPrices (body: OrderSchema) {
    const itemsIds = body.items.map(item => 
      Array.from({ length: item.quantidade }, () => 
        item.id)
    ).flat();

    const aditionalIds = body.items.map(item => 
      Array.from({ length: item.quantidade }, () => 
        item.adicionais.map(ads => ads.id))
    ).flat(2);

    const [productsPrices, aditionalsPrices]: [PricesFromDB[], PricesFromDB[]] = await Promise.all([
      this.repo.getProductsPrice(itemsIds),
      this.repo.getAditionalsPrice(aditionalIds)
    ]);

    if (productsPrices.length == 0 && aditionalsPrices.length == 0) {
      throw new CustomError('Nenhum produto cadastrado', 404, ErrorCode.PRODUCT_NOT_FOUND);
    }

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