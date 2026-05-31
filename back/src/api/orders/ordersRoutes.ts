import { Router } from "express";
import { OrdersController } from "../orders/ordersController";
import { OrdersService } from "../orders/ordersService";
import { OrderRepository } from "../orders/ordersRepository";
import { checkTenant } from "../../middlewares/check-tenant";
import { checkUser } from "../../middlewares/check-user";
import prisma from "../../lib/prisma/client";

const router = Router();
const repo = new OrderRepository(prisma as any);
const service = new OrdersService(repo);
const controller = new OrdersController(service);

router.get('/orders', checkTenant, controller.getOrders.bind(controller));

router.post('/orders', checkUser, controller.create.bind(controller));

router.patch('/orders/:orderId', checkTenant, controller.patchOrders.bind(controller));

export default router;