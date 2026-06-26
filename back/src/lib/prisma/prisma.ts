import { PrismaClient } from "../../generated/prisma/client";
import { CustomError } from "../../errors/errorHandler";
import { ErrorCode } from "../../types/constants/error-codes-constants";
import logger from "../winston/winston";
import { notifyDiscord } from "../../utils/notify-discord";

const prisma = new PrismaClient();

export async function prismaConnect (retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      logger.info('Trying to connect to DB');
      await prisma.$connect();
      logger.info('Connected');
      return;
    } catch (err) {
      logger.crit(`Conexão com o banco falhou, tentativa ${i+1}/${retries}. Tentando novamente em ${delay}`);
      await notifyDiscord('Erro no Postgres', 'Falha ao conectar com Prisma');
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw new CustomError('Falha ao conectar no banco', 500, ErrorCode.DB_CONNECT_ERROR);
}

export default prisma;