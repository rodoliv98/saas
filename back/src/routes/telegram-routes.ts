import { Router } from "express";
import { TelegramController } from "../controllers/telegram-controller";
import { TelegramService } from "../services/telegram-service";
import { TelegramRepo } from "../repository/telegram-repo";

const router = Router();
const repo = new TelegramRepo();
const service = new TelegramService(repo);
const controller = new TelegramController(service);

router.post('/telegram-webhook', controller.getOrders.bind(controller));

export default router;