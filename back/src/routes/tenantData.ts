import { TenantDataController } from "../controllers/tenantDataController"
import { TenantDataService } from "../services/tenantDataService";
import { TenantDataRepository } from "../repository/tenantDataRepository";
import { checkLogin } from "../middlewares/checkLogin"
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