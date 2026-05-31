import logger from './src/lib/winston/winston';
process.on('uncaughtException', (err) => logger.error(err));
process.on('unhandledRejection', (reason) => logger.error(reason));
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import tenantProducts from './src/routes/tenantProductsRoutes';
import loginRoutes from './src/api/login/loginRoutes';
import registerRoutes from './src/api/register/register-routes';
import tenantData from './src/api/tenant-data/tenant-data-routes';
import tenantHome from './src/api/tenant-home/tenant-home-routes'
import tenantStore from './src/routes/tenantStoreRoute';
import tenantFlavors from './src/routes/tenantFlavorsRoutes';
import orderRoutes from './src/api/orders/ordersRoutes';
import userRegister from './src/routes/user-register-routes';
import userData from './src/routes/user-data-routes';
import refreshRoutes from './src/api/refresh/refresh-routes';
import adminRoutes from './src/api/admin/admin-routes';
import telegram from './src/api/telegram/telegram-routes';
import http from 'node:http';
import helmet from 'helmet';
import { CustomError, errorHandler } from './src/errors/errorHandler'
import { ErrorCode } from './src/types/constants/error-codes-constants';
import { requestLogger } from './src/middlewares/request-logger';
import { apiLimiter, authLimiter } from './src/middlewares/rate-limiter';
import { dbConnect } from './src/lib/prisma/client';
import 'dotenv/config';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());

const FIRST_PROD_URL = process.env.CORS_PRODUCTION1;
const SECOND_PROD_URL =process.env.CORS_PRODUCTION2;

if (!FIRST_PROD_URL || !SECOND_PROD_URL) {
  throw new CustomError('Prod url não configurada', 500, ErrorCode.INTERNAL_SERVER_ERROR);
}

const server = http.createServer(app);
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
  ? [FIRST_PROD_URL, SECOND_PROD_URL]
  : process.env.CORS_DEVELOPMENT,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}
app.use('*', (req, res, next) => {
  console.log('headers', req.headers);
  next();
})
app.use(requestLogger);

app.use('/static', express.static('public'));
app.use(express.json({ limit: '10kb' }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

app.use('/api/auth', userRegister);
app.use('/api/auth', loginRoutes);
app.use('/api/auth', registerRoutes);
app.use('/api', refreshRoutes);
app.use('/api', adminRoutes);
app.use('/api', userData);
app.use('/api', tenantProducts);
app.use('/api', tenantHome);
app.use('/api', tenantData);
app.use('/api', orderRoutes);
app.use('/api', tenantFlavors);
app.use('/api', telegram);
app.use('/api/health', (_req, res) => res.status(200).json({ message: 'oksss' }));
app.use('/api', tenantStore);

app.use(async(_req, _res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`running port ${PORT}`));