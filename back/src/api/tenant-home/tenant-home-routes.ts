import { Router } from "express";
import { TenantHomeController } from "./tenant-home-controller";
import { TenantHomeService } from "./tenant-home-service";
import { TenantHomeRepository } from "./tenant-home-repo";
import { checkTenant } from "../../middlewares/check-tenant";

const router = Router();
const repo = new TenantHomeRepository();
const service = new TenantHomeService(repo);
const controller = new TenantHomeController(service);

router.get('/tenant/home', checkTenant, controller.getHomeData.bind(controller));

export default router;