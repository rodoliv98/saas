import { Router } from "express";
import { OrdersController } from "../orders/ordersController";
import { OrdersService } from "../orders/ordersService";
import { OrderRepository } from "../orders/ordersRepository";
import { checkTenant } from "../../middlewares/check-tenant";
import prisma from "../../lib/client";

const router = Router();
const repo = new OrderRepository(prisma);
const service = new OrdersService(repo);
const controller = new OrdersController(service);

router.get('/orders', checkTenant, controller.getOrders.bind(controller));

router.post('/orders', checkTenant, controller.create.bind(controller));

router.patch('/orders/:orderId', checkTenant, controller.patchOrders.bind(controller));

export default router;