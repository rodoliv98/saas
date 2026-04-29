import { TenantDataController } from "./tenant-data-controller";
import { TenantDataService } from "./tenant-data-service";
import { TenantDataRepository } from "./tenant-data-repo";
import { checkTenant } from "../../middlewares/check-tenant"
import { Router } from "express"
import { upload } from "../../../cloudinary/multer";
import { validateImageType } from "../../middlewares/validateImageType";
import prisma from "../../lib/client";

const router = Router();
const repository = new TenantDataRepository(prisma);
const service = new TenantDataService(repository);
const controller = new TenantDataController(service);

router.get('/tenant-data', checkTenant, controller.getData.bind(controller));

router.get(`/tenant/orders`, checkTenant, controller.getOrders.bind(controller));
// finish
router.post('/tenant-create-payment');

router.patch('/tenant-data', checkTenant, controller.patchData.bind(controller));

router.patch('/tenant/logo', checkTenant, upload.single('logo'), validateImageType, controller.addLogo.bind(controller));

router.patch('/tenant/banner', checkTenant, upload.single('banner'), validateImageType, controller.addBanner.bind(controller));


export default router