import { LoginController } from "./loginController";
import { LoginService } from "./loginService";
import { LoginRepository } from "./loginRepository";
import { Router } from "express";
import prisma from "../../lib/prisma/client";

const router = Router();
const repository = new LoginRepository(prisma as any)
const service = new LoginService(repository);
const controller = new LoginController(service);

router.post('/login', controller.login.bind(controller));

export default router;