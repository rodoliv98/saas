import { Request, Response, NextFunction } from "express";
import { IUserDataService } from "../services/user-data-service";

export class UserDataController {
  constructor (private service: IUserDataService) {}

  async getData (req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user;
      if (!userId) return res.status(401).json({ error: 'Não autorizado' });
 
      const data = await this.service.getData(userId);
      res.status(200).json(data);

    } catch (err) {
      console.log('Erro no controlador user-data-controller getData method:\n');
      next(err);
    }
  }
}