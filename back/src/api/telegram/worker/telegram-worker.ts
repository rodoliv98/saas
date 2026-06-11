import { Worker } from "bullmq";
import { botAnswer } from "../../../utils/bot-answer";
import { connection } from "../../../lib/redis/redis-connect";
import logger from "../../../lib/winston/winston";

export const telegramWorker = new Worker(
  'telegram-bot',
  async (job) => {
    await botAnswer(job.data.chat_id, job.data.response);
  }, {
    connection,
    limiter: {
      max: 1,
      duration: 1000
    }
  });

telegramWorker.on('error', (err) => {
  logger.warning('Erro no worker', err);
})

process.on('SIGTERM', async () => await telegramWorker.close());