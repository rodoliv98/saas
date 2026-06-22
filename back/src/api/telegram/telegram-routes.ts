import { Router } from "express";
import { TelegramController } from "./telegram-controller";

const router = Router();
const controller = new TelegramController();

router.post('/telegram-webhook', controller.getOrders.bind(controller));

export default router;