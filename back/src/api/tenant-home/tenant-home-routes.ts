import { Router } from "express";
import { TenantHomeController } from "./tenant-home-controller";
import { TenantHomeService } from "./tenant-home-service";
import { TenantHomeRepository } from "./tenant-home-repo";
import { checkLogin } from "../../middlewares/checkLogin";

const router = Router();
const repo = new TenantHomeRepository();
const service = new TenantHomeService(repo);
const controller = new TenantHomeController(service);

router.get('/tenant/home', checkLogin, controller.getHomeData.bind(controller));

export default router;