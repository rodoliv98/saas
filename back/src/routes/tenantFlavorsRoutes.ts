import { TenantFlavorsController } from "../controllers/tenantFlavorsController";
import { TenantFlavorsService } from "../services/tenantFlavorsService";
import { TenantFlavorsRepository } from "../repository/tenantFlavorsRepository";
import { Router } from "express";
import { upload } from "../../cloudinary/multer";
import { checkLogin } from "../middlewares/checkLogin";

const router = Router();
const repo = new TenantFlavorsRepository();
const service = new TenantFlavorsService(repo);
const controller = new TenantFlavorsController(service);

router.get('/flavors/:id', checkLogin, controller.getFlavors.bind(controller));

router.get('/tenant-flavors/:id', checkLogin, controller.getFlavorById.bind(controller));

router.post('/flavors/:id',checkLogin, upload.single('image'), controller.create.bind(controller));

router.patch('/flavors/:id', checkLogin, upload.single('image'), controller.patch.bind(controller));

router.delete('/flavors/:id', checkLogin, controller.delete.bind(controller));

export default router;