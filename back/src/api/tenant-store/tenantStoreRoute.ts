import { Router } from 'express'
import { TenantStoreController } from './tenantStoreController';
import { TenantStoreService } from './tenantStoreService';
import { TenantStoreRepository } from './tenantStoreRepository';
import { checkTenant } from '../../middlewares/check-tenant';
import prisma from '../../lib/prisma/client';

const router = Router();
const repo = new TenantStoreRepository(prisma as any);
const service = new TenantStoreService(repo);
const controller = new TenantStoreController(service);

router.get('/tenant-is-open', checkTenant, controller.isOpen.bind(controller));

router.post('/tenant-delivery-code', checkTenant, controller.createDeliveryCode.bind(controller));

router.patch('/tenant-is-open', checkTenant, controller.patchIsOpen.bind(controller));

router.get('/cardapio/:slug', controller.getData.bind(controller));

export default router;