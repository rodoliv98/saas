import { Router } from "express";
import { OrdersController } from "../orders/ordersController";
import { OrdersService } from "../orders/ordersService";
import { OrderRepository } from "../orders/ordersRepository";
import { checkLogin } from "../../middlewares/checkLogin";

const router = Router();
const repo = new OrderRepository();
const service = new OrdersService(repo);
const controller = new OrdersController(service);

router.get('/orders', checkLogin, controller.getOrders.bind(controller));

router.post('/orders', checkLogin, controller.create.bind(controller));

router.patch('/orders/:orderId', checkLogin, controller.patchOrders.bind(controller));

export default router;