import { Worker } from "bullmq";
import { botAnswer } from "../../../utils/bot-answer";
import { redisConnection } from "../../../lib/redis/redis-connect";

const telegramWorker = new Worker(
  'telegram-bot',
  async (job) => {
    await botAnswer(job.data.chat_id, job.data.response);
  }, { connection: redisConnection });

process.on('SIGTERM', async () => await telegramWorker.close());