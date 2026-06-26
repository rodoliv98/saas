import { TenantProductsController } from "./tenantProductsController"
import { TenantProductsService } from "./tenantProductsService"
import { TenantProductsRepository } from "./tenantProductsRepository"
import { checkTenant } from "../../middlewares/check-tenant"
import { upload } from "../../../cloudinary/multer"
import { Router } from "express"
import { validateImageType } from "../../middlewares/validateImageType"
import prisma from "../../lib/prisma/client"

const router = Router();
const repository = new TenantProductsRepository(prisma as any);
const service = new TenantProductsService(repository);
const controller = new TenantProductsController(service);

router.get('/products', checkTenant, controller.getProducts.bind(controller));

router.get('/products/:id', checkTenant, controller.getProductById.bind(controller));

router.post('/products', checkTenant, upload.single('image'), validateImageType, controller.create.bind(controller));

router.patch('/products/:id', checkTenant, upload.single('image'), validateImageType, controller.patch.bind(controller));

router.delete('/products/:id', checkTenant, controller.delete.bind(controller));

export default router