import { UserRegisterController } from "./user-register-controller";
import { UserRegisterService } from "./user-register-service";
import { UserRegisterRepository } from "./user-register-repo";
import { Router } from "express";
import prisma from "../../lib/prisma/client";

const router = Router();
const repo = new UserRegisterRepository(prisma as any);
const service = new UserRegisterService(repo);
const contrller = new UserRegisterController(service);

router.post('/user-register', contrller.register.bind(contrller));

export default router;