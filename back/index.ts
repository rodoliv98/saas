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
import telegram from './src/api/telegram/telegram-routes';
import http from 'node:http';
import helmet from 'helmet';
import { Server } from 'socket.io';
import { errorHandler } from './src/middlewares/errorHandler'
import { requestLogger } from './src/middlewares/request-logger';
import { apiLimiter, authLimiter } from './src/middlewares/rate-limiter';
import 'dotenv/config'

const app = express();

app.set('trust proxy', 1);
app.use(helmet());

const server = http.createServer(app);
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
  ? 'still have to get a domain'
  : ['http://localhost:5173', 'http://localhost'],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(requestLogger);

app.use('/static', express.static('public'));
app.use(express.json({ limit: '10kb' }));
app.use(cors(corsOptions));
app.use(cookieParser());

export const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: process.env.NODE_ENV === 'production'
    ? 'still have to get a domain'
    : ['http://localhost:5173', 'http://localhost'],
    methods: ["GET"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('IP:', socket.handshake.address);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

app.use('/api/auth', userRegister);
app.use('/api/auth', loginRoutes);
app.use('/api/auth', registerRoutes);
app.use('/api', refreshRoutes);
app.use('/api', userData);
app.use('/api', tenantProducts);
app.use('/api', tenantHome);
app.use('/api', tenantData);
app.use('/api', orderRoutes);
app.use('/api', tenantFlavors);
app.use('/api', telegram);
app.use('/api', tenantStore);
app.use(errorHandler);

server.listen(3000, () => console.log('running'));