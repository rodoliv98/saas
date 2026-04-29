import { TenantFlavorsController } from "../controllers/tenantFlavorsController";
import { TenantFlavorsService } from "../services/tenantFlavorsService";
import { TenantFlavorsRepository } from "../repository/tenantFlavorsRepository";
import { Router } from "express";
import { upload } from "../../cloudinary/multer";
import { checkTenant } from "../middlewares/check-tenant";
import { validateImageType } from "../middlewares/validateImageType";
import prisma from "../lib/client";

const router = Router();
const repo = new TenantFlavorsRepository(prisma);
const service = new TenantFlavorsService(repo);
const controller = new TenantFlavorsController(service);

router.get('/flavors/:id', checkTenant, controller.getFlavors.bind(controller));

router.get('/tenant-flavors/:id', checkTenant, controller.getFlavorById.bind(controller));

router.post('/flavors/:id', checkTenant, upload.single('image'), validateImageType, controller.create.bind(controller));

router.patch('/flavors/:id', checkTenant, upload.single('image'), validateImageType, controller.patch.bind(controller));

router.delete('/flavors/:id', checkTenant, controller.delete.bind(controller));

export default router;