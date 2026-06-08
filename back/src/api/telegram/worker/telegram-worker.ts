import { Worker } from "bullmq";
import { botAnswer } from "../../../utils/bot-answer";
import { redisConnection } from "../../../lib/redis/redis-connect";
import logger from "../../../lib/winston/winston";

export const telegramWorker = new Worker(
  'telegram-bot',
  async (job) => {
    await botAnswer(job.data.chat_id, job.data.response);
  }, { connection: redisConnection });

telegramWorker.on('error', (err) => {
  logger.warning('Erro no worker', err);
})

process.on('SIGTERM', async () => await telegramWorker.close());