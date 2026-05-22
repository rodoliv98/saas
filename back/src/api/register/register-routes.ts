import { RegisterController } from "./register-controller";
import { RegisterService } from "./register-service";
import { RegisterRepository } from "./register-repo";
import { dataValidator } from "../../middlewares/dataValidator";
import { Router } from "express";
import prisma from "../../lib/prisma/client";

const router = Router();
const repository = new RegisterRepository(prisma);
const service = new RegisterService(repository);
const controller = new RegisterController(service);

router.post('/register', dataValidator, controller.register.bind(controller));

export default router