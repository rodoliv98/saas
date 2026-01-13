import { RegisterController } from "../controllers/registerController";
import { RegisterService } from "../services/registerService";
import { RegisterRepository } from "../repository/registerRepository";
import { dataValidator } from "../middlewares/dataValidator";
import { Router } from "express";

const router = Router();
const repository = new RegisterRepository();
const service = new RegisterService(repository);
const controller = new RegisterController(service);

router.post('/register', dataValidator, controller.register.bind(controller));

export default router