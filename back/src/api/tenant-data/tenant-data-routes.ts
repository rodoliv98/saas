import { TenantDataController } from "./tenant-data-controller";
import { TenantDataService } from "./tenant-data-service";
import { TenantDataRepository } from "./tenant-data-repo";
import { checkLogin } from "../../middlewares/checkLogin"
import { Router } from "express"

const router = Router();
const repository = new TenantDataRepository();
const service = new TenantDataService(repository);
const controller = new TenantDataController(service);

router.get('/tenant-data', checkLogin, controller.getData.bind(controller));

router.get(`/tenant/orders`, checkLogin, controller.getOrders.bind(controller));
// finish
router.post('/tenant-create-payment');

router.patch('/tenant-data', checkLogin, controller.patchData.bind(controller));


export default router