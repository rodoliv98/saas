import { Router } from "express";
import { TelegramController } from "./telegram-controller";
import { TelegramService } from "./telegram-service";
import { TelegramRepo } from "./telegram-repo";
import prisma from "../../lib/prisma/client";

const router = Router();
const repo = new TelegramRepo(prisma as any);
const service = new TelegramService(repo);
const controller = new TelegramController(service);

router.post('/telegram-webhook', controller.getOrders.bind(controller));

export default router;