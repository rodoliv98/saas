import { CustomError } from "../../middlewares/errorHandler";
import { ITelegramRepo } from "./telegram-repo";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { DeliveryManDTO } from "../../types/dtos/delivery-register-dto";
import { UpdateDeliveryDTO } from "../../types/dtos/delivery-update-dto";
import { OrdersDelivery } from "../../types/entities/orders-data";
import { UpdatedDelivery } from "../../types/entities/updated-delivery";
import { botAnswer } from "../../utils/bot-answer";

export interface ITelegramService {
  getOrders(pin: string, chat_id: bigint): Promise<string>;
  updateDeliveryOrder(updateCode: string): Promise<string>;
  useActivationCode(data: DeliveryManDTO): Promise<string>;
}

export class TelegramService implements ITelegramService {
  constructor (private repo: ITelegramRepo) {}

  async getOrders (pin: string, chat_id: bigint) {
    const deliveryMan = await this.repo.findDeliveryMan(pin, chat_id);
    if (!deliveryMan) {
      throw new CustomError('Nenhum entragador com esse chatId encontrado', 404, ErrorCode.DELIVERY_ERROR);
    }
    console.log("deliveryMan:", deliveryMan);
    const orders = await this.repo.getOrders(pin);
    if (!orders) {
      throw new CustomError('Nenhum tenant com esse pin foi encontrado', 404, ErrorCode.DELIVERY_ERROR);
    };

    return this.formatData(orders);
  }

  async updateDeliveryOrder (updateCode: string) {
    const updateObj = this.formatUpdateObject(updateCode);
    const updated = await this.repo.updateDeliveryOrder(updateObj);

    const message = this.formatUpdateDelivery(updated);
    return message;
  }

  async useActivationCode (data: DeliveryManDTO) {
    const code = await this.repo.findActivationCode(data.codigo_ativacao);
    if (!code) {
      throw new CustomError('Código não encontrado', 404, ErrorCode.DELIVERY_ERROR);
    }

    const now = new Date().getTime();
    if (code.expire_date.getTime() < now || code.utilizado !== false) {
      await botAnswer(data.chat_id, `Seu código expirou, você precisa de um novo`);
      throw new CustomError('Código de ativação expirou', 410, ErrorCode.DELIVERY_ERROR);
    }

    const body = {
      nome_telegram: data.nome_telegram,
      tenant_id: code.tenant_id,
      chat_id: data.chat_id,
      codigo_ativacao: code.codigo,
    }

    await this.repo.registerDeliveryMan(body);
    const tenantSlug = data.codigo_ativacao.split(':')[1];
    return tenantSlug;
  }

  private formatUpdateObject (updateCode: string) {
    const [upperCode, status] = updateCode.split(':');
    const lowerCode = upperCode.toLowerCase();
    const lowerStatus = status.toLowerCase();

    const validStatus = ['concluido', 'cancelado'];
    if (!validStatus.includes(lowerStatus)) {
      throw new CustomError('Status fornecido é inválido', 400, ErrorCode.DELIVERY_ERROR);
    }

    return { code: lowerCode, status: lowerStatus } as UpdateDeliveryDTO;
  }

  private formatData (arr: OrdersDelivery[]) {
    const header = `*Você tem ${arr.length} entregas*\n\n`;
    let footer = `\n\nPara marcar um pedido como concluido digite o ID do pedido com o novo status dele separado por dois pontos :\n`;
    footer += `Exemplo wca21w:concluido`;

    const orders = arr.map((a, i) => {
      let msg = `#${i + 1} ID do pedido: *${a.short_id}*\n`;
      msg += `*DADOS DA ENTREGA*\n`;
      msg += `---------------------------------\n`;
      msg += `Cliente: *${a.nomeCompleto}*\n`;
      msg += `Endereço: *${a.endereco}*\n`;
      msg += `Bairro: *${a.bairro}*\n`;
      msg += `Número da casa: *${a.numero}*\n`;
      a.complemento ? msg += `Complemento: *${a.complemento}*\n` : null;
      msg += `---------------------------------\n`;
      msg += `*DETALHES DO PEDIDO*\n`;
      msg += `---------------------------------\n`;
      a.pedidosItens.forEach((item: any) => {
        msg += `Produto: ${item.nomeProduto}\n`,
        msg += `Quantidade: ${item.quantidade}\n`,
        item.itensAdicionais.forEach((add: any) => {
          msg += `ADICIONAIS\n`,
          msg += `${add.nomeProduto}\n`
        });
        msg += `---------------------------------\n`;
      })
      msg += `Forma de pagamento: *${a.formaPagamento.toUpperCase()}*\n`;
      msg += `Valor do pedido: *${a.totalOrderPrice}*\n`;
      

      return msg;
    }).join('\n\n');

    if (arr.length === 0) {
      return header;
    }

    return header + orders + footer;
  }

  private formatUpdateDelivery (update: UpdatedDelivery) {
    let msg = `Você atualizou o pedido de: *${update.nomeCompleto}*\n`;
    msg += `endereço: *${update.endereco}*\n`;
    msg += `bairro: *${update.bairro}*\n`;
    update.complemento ? msg += `complemento: *${update.complemento}*\n` : null;
    msg += `O novo status do pedido agora é: *${update.status}*`;

    return msg;
  }
}