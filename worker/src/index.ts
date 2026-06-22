import { Worker, Queue } from "bullmq";
import redis, { connection } from "./lib/redis/redis";
import { redisConnect } from "./lib/redis/redis";
import logger from "./lib/winston/winston";
import prisma, { prismaConnect } from "./lib/prisma/prisma";
import { TelegramService } from "./service/telegram-service";
import { TelegramRepo } from "./repository/telegram-repository";
import 'dotenv/config';

async function main() {
  logger.info('Iniciando worker');

  await prismaConnect();
  await redisConnect();
  
  logger.info('Dbs conectados');

  const repo = new TelegramRepo(prisma)
  const service = new TelegramService(repo);

  const worker = [
    new Worker('telegram-getOrders',           async (job) => service.getOrders(job.data.body, job.data.chat_id), { connection }),
    new Worker('telegram-updateDeliveryOrder', async (job) => service.updateDeliveryOrder(job.data.body, job.data.chat_id), { connection }),
    new Worker('telegram-useActivationCode',   async (job) => service.useActivationCode(job.data.data), { connection }),
  ];

  logger.info('Workers prontos');

  const shutdown = async () => {
    logger.info('Encerrando processos');
    Promise.all(worker.map(w => w.close()));
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
  }

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => {
  logger.emerg('Erro nos workers', err);
  // process.exit(1);
});