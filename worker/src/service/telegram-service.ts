import logger from "../lib/winston/winston";
import { DeliveryUpdate, OrdersDelivery } from "../repository/entitie/order-entitie";
import { ITelegramRepo } from "../repository/telegram-repository";
import { botAnswer } from "../utils/telegram-bot";
import { DeliveryManDTO, UpdateDeliveryDTO } from "./dto/service-dto";

export interface ITelegramService {
  getOrders(pin: string, chat_id: bigint): Promise<void>;
  updateDeliveryOrder(updateCode: string, chat_id: bigint): Promise<void>;
  useActivationCode(data: DeliveryManDTO): Promise<void>;
}

export class TelegramService implements ITelegramService {
  constructor (private repo: ITelegramRepo) {}

  async getOrders (pin: string, chat_id: bigint) {
    const deliveryMan = await this.repo.findDeliveryMan(pin, chat_id);
    if (!deliveryMan) {
      logger.warning('Nenhum entragador com esse chatId encontrado', {
        status: 404,
        code: 'TELEGRAM_ERROR'
      });
      return;
    }

    const orders = await this.repo.getOrders(pin);
    if (!orders) {
      logger.warning('Entregador digitou um pin incorreto', {
        status: 404,
        code: 'TELEGRAM_ERROR'
      });
      await botAnswer(chat_id, 'Pin incorreto');
      return;
    };
    
    if (orders.length === 0) {
      await botAnswer(chat_id, 'Nenhuma entrega no momento');
      return;  
    }

    const formatedRes = this.formatData(orders);
    await botAnswer(chat_id, formatedRes);
    return;
  }

  async updateDeliveryOrder (updateCode: string, chat_id: bigint) {
    const updateObj = this.formatUpdateObject(updateCode);
    if (!updateObj) {
      await botAnswer(chat_id, 'Status fornecido é inválido');
      return;
    }
    
    const updated = await this.repo.updateDeliveryOrder(updateObj);
    if (typeof updated === 'string') {
      await botAnswer(chat_id, updated);
      return;
    }

    const message = this.formatUpdateDelivery(updated);
    await botAnswer(chat_id, message);
    return;
  }

  async useActivationCode (data: DeliveryManDTO) {
    const code = await this.repo.findActivationCode(data.codigo_ativacao);
    if (!code) {
      logger.warning('Código de ativação não criado ou não encontrado', {
        status: 404,
        code: 'TELEGRAM_ERROR'
      });
      return;
    }

    const now = new Date().getTime();
    if (code.expire_date.getTime() < now || code.utilizado !== false) {
      logger.warning('Código de ativação expirou', {
        status: 410,
        code: 'TELEGRAM_ERROR'
      });
      await botAnswer(data.chat_id, 'Seu código expirou, você precisa de um novo');
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
    await botAnswer(data.chat_id, `Você está agora cadastrado como entregador da loja *${tenantSlug}*`);
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
        code: 'TELEGRAM_ERROR'
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