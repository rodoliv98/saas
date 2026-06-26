import { Router } from "express";
import { UserDataController } from "./user-data-controller";
import { UserDataService } from "./user-data-service";
import { UserDataRepository } from "./user-data-repo";
import { checkUser } from "../../middlewares/check-user";
import prisma from "../../lib/prisma/client";

const router = Router();
const repo = new UserDataRepository(prisma as any);
const service = new UserDataService(repo);
const controller = new UserDataController(service);

router.get('/user-data', checkUser, controller.getData.bind(controller));

export default router;