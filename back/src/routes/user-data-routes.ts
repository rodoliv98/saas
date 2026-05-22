import { Router } from "express";
import { UserDataController } from "../controllers/user-data-controller";
import { UserDataService } from "../services/user-data-service";
import { UserDataRepository } from "../repository/user-data-repo";
import { checkUser } from "../middlewares/check-user";
import prisma from "../lib/prisma/client";

const router = Router();
const repo = new UserDataRepository(prisma);
const service = new UserDataService(repo);
const controller = new UserDataController(service);

router.get('/user-data', checkUser, controller.getData.bind(controller));

export default router;