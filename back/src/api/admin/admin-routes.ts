import { AdminController } from "./admin-controller";
import { AdminService } from "./admin-service";
import { AdminRepository } from "./admin-repo";
import { Router } from "express";
import prisma from '../../lib/client';

const router = Router();
const repo = new AdminRepository(prisma);
const service = new AdminService(repo);
const controller = new AdminController(service);

router.post('/admin/login', controller.login.bind(controller));

export default router;