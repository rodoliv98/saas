import { Router } from "express";
import { PaymentRepository } from "../repository/payment-repository";
import { PaymentService } from "../services/payment-service";
import { PaymentController } from "../controllers/payment-controller";

const router = Router();
const repo = new PaymentRepository();
const service = new PaymentService(repo);
const controller = new PaymentController(service);

router.post('/payment', controller.createPayment.bind(controller));

export default router;