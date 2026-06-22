import { notifyDiscord } from "../../utils/notify-discord";
import { CustomError } from "../../errors/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import { Queue, createNodeRedisClient } from "bullmq";
import { createClient } from "redis";
import logger from "../winston/winston";

const redis = createClient({
  url: process.env.REDIS_URL
});

redis.on('error', err => logger.emerg('Erro no Redis', err));

export const connection = createNodeRedisClient(redis as any);
export const telegramGetOrders = new Queue('telegram-getOrders', { connection });
export const telegramUseActivationCod = new Queue('telegram-useActivationCode', { connection });
export const telegramUpdateDeliveryOrder = new Queue('telegram-updateDeliveryOrder', { connection });

export async function redisConnect(retries = 5, delay = 5000) {
  for(let i = 0; i < retries; i++){
    try {
      logger.info('Tentando conectar no Redis');
      
      if(!redis.isOpen) {
        await redis.connect();
      }

      logger.info('Conectado no Redis');
      return;
    } catch (err) {
      logger.warn(`Conexão ao Redis falhou; tentativa ${i+1}/${retries}`);
      await notifyDiscord('Erro no Redis', `Tentativa ${i+1}/${retries}`);
      
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw new CustomError('Não foi possível se conectar ao Redis', 500, ErrorCode.DB_CONNECT_ERROR)
}

export default redis;