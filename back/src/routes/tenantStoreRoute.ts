import { Router } from 'express'
import { TenantStoreController } from '../controllers/tenantStoreController';
import { TenantStoreService } from '../services/tenantStoreService';
import { TenantStoreRepository } from '../repository/tenantStoreRepository';
import { checkLogin } from '../middlewares/checkLogin';

const router = Router();
const repo = new TenantStoreRepository();
const service = new TenantStoreService(repo);
const controller = new TenantStoreController(service);

router.get('/tenant-is-open', checkLogin, controller.isOpen.bind(controller));

router.post('/tenant-delivery-code', checkLogin, controller.createDeliveryCode.bind(controller));

router.patch('/tenant-is-open', checkLogin, controller.patchIsOpen.bind(controller));

router.get('/:slug', controller.getData.bind(controller));

export default router;