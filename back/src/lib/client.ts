import { PrismaClient } from "../generated/prisma/client";
import { CustomError } from "../middlewares/errorHandler";
import { ErrorCode } from "../types/constants/error-codes-constants";
import logger from "../winston/winston";

const prisma = new PrismaClient();

export async function dbConnect (retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      logger.info('Trying to connect to DB');
      await prisma.$connect();
      logger.info('Connected');
      return;
    } catch (err) {
      logger.info(`Conexão com o banco falhou, tentativa ${i+1}/${retries}. Tentando novamente em ${delay}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw new CustomError('Falha ao conectar no banco', 500, ErrorCode.INTERNAL_SERVER_ERROR);
}

export default prisma;