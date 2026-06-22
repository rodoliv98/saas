import { createClient } from "redis";
import { Queue, createNodeRedisClient } from "bullmq";
import { notifyDiscord } from "../../utils/notify-discord";
import logger from "../winston/winston";

const redis = createClient({
  url: process.env.REDIS_URL
});

redis.on('error', err => logger.emerg('Erro no redis', err));

export const connection = createNodeRedisClient(redis as any);

export async function redisConnect(retries = 5, delay = 5000) {
  for(let i = 0; i < retries; i++){
    try {
      logger.info('Worker tentando conectar no Redis');
      
      if(!redis.isOpen) {
        await redis.connect();
      }

      logger.info('Worker conectado no Redis');
      return;
    } catch (err) {
      logger.warn(`Worker não pode conectar ao Redis; tentativa ${i+1}/${retries}`);
      // await notifyDiscord('Erro no Redis', `Tentativa ${i+1}/${retries}`);
      
      await new Promise(r => setTimeout(r, delay));
    }
  }

  logger.emerg('Não foi possível se conectar ao Redis');
}

export default redis;