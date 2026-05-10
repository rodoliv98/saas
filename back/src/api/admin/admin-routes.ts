import { AdminController } from "./admin-controller";
import { AdminService } from "./admin-service";
import { AdminRepository } from "./admin-repo";
import { Router } from "express";
import { checkAdmin } from "../../middlewares/check-admin";
import prisma from '../../lib/client';
// import bcrypt from 'bcrypt';

const router = Router();
const repo = new AdminRepository(prisma);
const service = new AdminService(repo);
const controller = new AdminController(service);

router.post('/admin/login', controller.login.bind(controller));

router.get('/admin/tenants', checkAdmin, controller.findAllTenants.bind(controller));

router.patch('/admin/tenants/store', checkAdmin, controller.changeStoreStatus.bind(controller));

router.patch('/admin/tenants/active', checkAdmin, controller.changeStoreActiveStatus.bind(controller));

/* router.post('/test-acc', async (req, res) => {
  console.log('hit')
  const hash = await bcrypt.hash(req.body.senha, 10);

  const admin = await prisma.admins.create({
    data: {
      email: req.body.email,
      senha: hash
    }
  });

  res.status(200).json(admin);
}) */

export default router;