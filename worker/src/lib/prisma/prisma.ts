import { PrismaClient } from "../../generated/prisma/client";
import { notifyDiscord } from "../../utils/notify-discord";
import logger from "../winston/winston";

const prisma = new PrismaClient();

export async function prismaConnect (retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      logger.info('Worker tentando conectar no Prisma');
      await prisma.$connect();
      logger.info('Worker conectado no Prisma');
      return;
    } catch (err) {
      logger.crit(`Worker não pode conectar ao Prisma; tentativa ${i+1}/${retries}. Tentando novamente em ${delay}`, err);
      // await notifyDiscord('Erro no Postgres', 'Falha ao conectar com Prisma');
      await new Promise(r => setTimeout(r, delay));
    }
  }

  logger.emerg('Falha ao conectar no banco');
}

export default prisma;