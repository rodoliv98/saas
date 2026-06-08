import { ITelegramRepo } from "./telegram-repo";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { DeliveryManDTO } from "./dto/delivery-dtos";
import { UpdateDeliveryDTO } from "./dto/delivery-dtos";
import { OrdersDelivery } from "./intities/order-entities";
import { DeliveryUpdate } from "./intities/delivery-entities";
import { telegramQueue } from "../../lib/redis/redis-connect";
import logger from "../../lib/winston/winston";

export interface ITelegramService {
  getOrders(pin: string, chat_id: bigint): Promise<void>;
  updateDeliveryOrder(updateCode: string, chat_id: string): Promise<void>;
  useActivationCode(data: DeliveryManDTO): Promise<void>;
}

export class TelegramService implements ITelegramService {
  constructor (private repo: ITelegramRepo) {}

  async getOrders (pin: string, chat_id: bigint) {
    const deliveryMan = await this.repo.findDeliveryMan(pin, chat_id);
    if (!deliveryMan) {
      logger.warning('Nenhum entragador com esse chatId encontrado', {
        status: 404,
        code: ErrorCode.TELEGRAM_ERROR
      });
      return;
    }

    const orders = await this.repo.getOrders(pin);
    if (!orders) {
      logger.warning('Entregador digitou um pin incorreto', {
        status: 404,
        code: ErrorCode.TELEGRAM_ERROR
      });
      await telegramQueue.add(
        'telegram-bot',
        { chat_id, response: 'Pin incorreto' }
      );
      return;
    };
    
    if (orders.length === 0) {
      await telegramQueue.add(
        'telegram-bot', 
        { chat_id, response: 'Nenhuma entrega no momento' }
      );
      return;  
    }

    const formatedRes = this.formatData(orders);
    await telegramQueue.add(
      'telegram-bot', 
      { chat_id, response: formatedRes }
    );
    return;
  }

  async updateDeliveryOrder (updateCode: string, chat_id: string) {
    const updateObj = this.formatUpdateObject(updateCode);
    if (!updateObj) {
      await telegramQueue.add(
        'telegram-bot',
        { chat_id, response: 'Status fornecido é inválido' }
      );
      return;
    }
    
    const updated = await this.repo.updateDeliveryOrder(updateObj);

    const message = this.formatUpdateDelivery(updated);
    await telegramQueue.add(
      'telegram-bot',
      { chat_id, response: message }
    )
    return;
  }

  async useActivationCode (data: DeliveryManDTO) {
    const code = await this.repo.findActivationCode(data.codigo_ativacao);
    if (!code) {
      logger.warning('Código de ativação não criado ou não encontrado', {
        status: 404,
        code: ErrorCode.TELEGRAM_ERROR
      });
      return;
    }

    const now = new Date().getTime();
    if (code.expire_date.getTime() < now || code.utilizado !== false) {
      await telegramQueue.add(
        'telegram-bot', 
        { chat_id: data.chat_id, response: `Seu código expirou, você precisa de um novo` }
      );
      logger.warning('Código de ativação expirou', {
        status: 410,
        code: ErrorCode.TELEGRAM_ERROR
      });
      return;
    }

    const body = {
      nome_telegram: data.nome_telegram,
      tenant_id: code.tenant_id,
      chat_id: data.chat_id,
      codigo_ativacao: code.codigo,
    }

    await this.repo.registerDeliveryMan(body);
    const tenantSlug = data.codigo_ativacao.split(':')[1];
    await telegramQueue.add(
      'telegram-bot',
      { chat_id: data.chat_id, response: `Você agora está cadastrado como entregador da loja *${tenantSlug}*` }
    )
    return;
  }

  private formatUpdateObject (updateCode: string) {
    const [upperCode, status] = updateCode.split(':');
    const lowerCode = upperCode.toLowerCase();
    const lowerStatus = status.toLowerCase();

    const validStatus = ['concluido', 'cancelado'];
    if (!validStatus.includes(lowerStatus)) {
      logger.warn('Status fornecido é inválido', {
        status: 400,
        code: ErrorCode.TELEGRAM_ERROR
      });
      return;
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

  private formatUpdateDelivery (update: DeliveryUpdate) {
    let msg = `Você atualizou o pedido de: *${update.nomeCompleto}*\n`;
    msg += `endereço: *${update.endereco}*\n`;
    msg += `bairro: *${update.bairro}*\n`;
    update.complemento ? msg += `complemento: *${update.complemento}*\n` : null;
    msg += `O novo status do pedido agora é: *${update.status}*`;

    return msg;
  }
}