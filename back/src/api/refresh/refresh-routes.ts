import { RefreshController } from "./refresh-controller";
import { RefreshService } from "./refresh-service";
import { RefreshRepository } from "./refresh-repo";
import { PrismaClient } from '../../generated/prisma/client';
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();
const repository = new RefreshRepository(prisma)
const service = new RefreshService(repository);
const controller = new RefreshController(service);

router.post('/refresh', controller.refresh.bind(controller));

router.post('/logout', controller.logout.bind(controller));

export default router;