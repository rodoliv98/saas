import { UserRegisterController } from "../controllers/user-register-controller";
import { UserRegisterService } from "../services/user-register-service";
import { UserRegisterRepository } from "../repository/user-register-repo";
import { Router } from "express";
import prisma from "../lib/client";

const router = Router();
const repo = new UserRegisterRepository(prisma);
const service = new UserRegisterService(repo);
const contrller = new UserRegisterController(service);

router.post('/user-register', contrller.register.bind(contrller));

export default router;