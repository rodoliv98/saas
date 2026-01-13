import { Router } from "express";
import { UserDataController } from "../controllers/user-data-controller";
import { UserDataService } from "../services/user-data-service";
import { UserDataRepository } from "../repository/user-data-repo";
import { checkLogin } from "../middlewares/checkLogin";

const router = Router();
const repo = new UserDataRepository();
const service = new UserDataService(repo);
const controller = new UserDataController(service);

router.get('/user-data', checkLogin, controller.getData.bind(controller));

export default router;