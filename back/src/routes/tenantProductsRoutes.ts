import { TenantProductsController } from "../controllers/tenantProductsController"
import { TenantProductsService } from "../services/tenantProductsService"
import { TenantProductsRepository } from "../repository/tenantProductsRepository"
import { checkLogin } from "../middlewares/checkLogin"
import { upload } from "../../cloudinary/multer"
import { Router } from "express"
import { validateImageType } from "../middlewares/validateImageType"

const router = Router();
const repository = new TenantProductsRepository();
const service = new TenantProductsService(repository);
const controller = new TenantProductsController(service);

router.get('/products', checkLogin, controller.getProducts.bind(controller));

router.get('/products/:id', checkLogin, controller.getProductById.bind(controller));

router.post('/products', checkLogin, upload.single('image'), validateImageType, controller.create.bind(controller));

router.patch('/products/:id', checkLogin, upload.single('image'), validateImageType, controller.patch.bind(controller));

router.delete('/products/:id', checkLogin, controller.delete.bind(controller));

export default router