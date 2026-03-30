import { LoginController } from "./loginController";
import { LoginService } from "./loginService";
import { LoginRepository } from "./loginRepository";
import { PrismaClient } from '../../generated/prisma/client';
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();
const repository = new LoginRepository(prisma)
const service = new LoginService(repository);
const controller = new LoginController(service);

router.post('/login', controller.login.bind(controller));

router.post('/refresh', controller.refresh.bind(controller));

router.post('/logout', controller.logout.bind(controller));

export default router;