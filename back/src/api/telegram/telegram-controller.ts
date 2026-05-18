import { Request, Response, NextFunction } from "express"
import { botAnswer } from "../../utils/bot-answer";
import { ITelegramService } from "./telegram-service";
import { CustomError } from "../../middlewares/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
// ainda é necessário fazer o tratamento de erro
// de forma apropriada nos setImmediate
export class TelegramController {
  constructor (private service: ITelegramService) {}
  // não coloquei os types que são usados apenas aqui numa nova pasta types
  async getOrders (req: Request, res: Response, next: NextFunction) {
    try {
      const secret = req.headers['x-telegram-bot-api-secret-token'];      // A checagem de tokens é necessária porque o endpoint pode
      const myToken = process.env.TELEGRAM_SECRET_TOKEN;                  // receber reqs de outras fontes além do bot

      if (secret !== myToken) {
        console.log('foi bloqueado');
        return res.sendStatus(403);
      }
      console.log('chegou no controlador');
      res.sendStatus(200);

      const body = req.body.message.text;
      const chatId = req.body.message.chat.id;

      const pinRegex = /^\d{6}$/;
      const activationCodeRegex = /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}:[a-záàâãäéèêëíìîïóòôõöúùûüçñA-ZÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]+$/;
      const finishOrderRegex = /^[a-zA-Z0-9]{6}\:(concluido|cancelado)$/i;

      // tem que lidar com erros 429'too many requests' e 403'bot bloqueado pelo usuário'
      if (pinRegex.test(body)) {
        setImmediate(async () => {
          try {
            console.log('entrou no if')
            const text = await this.service.getOrders(body, chatId);
            console.log('cadastrou no banco');
            await botAnswer(chatId, text);
            console.log('enviou pelo bot');
          } catch (err) {
            throw new CustomError('Erro ao tentar verificar pedidos prontos', 500, ErrorCode.TELEGRAM_ERROR);
          }
        });

        return;
      }

      if (activationCodeRegex.test(body)) {
        setImmediate(async () => {
          try {
            const firtName = req.body.message.chat.first_name;
            const lastName = req.body.message.chat.last_name;
            const fullName = firtName + lastName;
  
            const data = {
              nome_telegram: fullName,
              chat_id: chatId,
              codigo_ativacao: body
            };
  
            const tenantSlug = await this.service.useActivationCode(data);
            await botAnswer(chatId, `Você agora está cadastrado como entregador da loja *${tenantSlug}*`);
            
          } catch (err) {
            throw new CustomError('Erro ao tentar usar código de ativação', 500, ErrorCode.TELEGRAM_ERROR);
          }
        });

        return;
      }

      if (finishOrderRegex.test(body)) {
        setImmediate(async () => {
          try {
            const message = await this.service.updateDeliveryOrder(body);
            await botAnswer(chatId, message);
            
          } catch (err) {
            throw new CustomError('Erro ao tentar atualizar status de entrega', 500, ErrorCode.TELEGRAM_ERROR);
          }
        });

        return;
      }
  
    } catch (err) {
      console.log('Erro no controlador TelegramController method getOrders:\n', err);
      next(err);
    }
  } 
}