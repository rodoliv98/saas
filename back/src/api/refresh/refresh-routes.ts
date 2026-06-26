import { RefreshController } from "./refresh-controller";
import { RefreshService } from "./refresh-service";
import { RefreshRepository } from "./refresh-repo";
import { Router } from "express";
import prisma from "../../lib/prisma/prisma";

const router = Router();
const repository = new RefreshRepository(prisma as any)
const service = new RefreshService(repository);
const controller = new RefreshController(service);

router.post('/refresh', controller.refresh.bind(controller));

router.post('/logout', controller.logout.bind(controller));

export default router;