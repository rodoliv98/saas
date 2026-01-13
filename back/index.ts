import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import tenantProducts from './src/routes/tenantProductsRoutes';
import loginRoutes from './src/api/login/loginRoutes';
import registerRoutes from './src/routes/registerRoutes';
import tenantData from './src/routes/tenantData';
import tenantStore from './src/routes/tenantStoreRoute';
import tenantFlavors from './src/routes/tenantFlavorsRoutes';
import orderRoutes from './src/api/orders/ordersRoutes';
import userRegister from './src/routes/user-register-routes';
import userData from './src/routes/user-data-routes';
import telegram from './src/routes/telegram-routes';
import paymentRoutes from './src/routes/payment-routes';
import http from 'node:http';
import { Server } from 'socket.io';
import { errorHandler } from './src/middlewares/errorHandler'
import 'dotenv/config'


const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}

app.use(express.json({ limit: '10kb' }));
app.use(cors(corsOptions));
app.use(cookieParser());

export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('IP:', socket.handshake.address);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use('/', userRegister);
app.use('/', userData);
app.use('/', paymentRoutes);
app.use('/', tenantProducts);
app.use('/', loginRoutes);
app.use('/', registerRoutes);
app.use('/', tenantData);
app.use('/', orderRoutes);
app.use('/', tenantFlavors);
app.use('/', telegram);
app.use('/', tenantStore);
app.use(errorHandler);

server.listen(3000, () => console.log('running'));