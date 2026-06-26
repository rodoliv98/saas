import { Request, Response, NextFunction } from "express";
import { IUserRegisterService } from "./user-register-service";
import { userRegisterSchema } from "./schemas/user-register-schema";

export class UserRegisterController {
  constructor (private service: IUserRegisterService) {}
  
  async register (req: Request, res: Response, next: NextFunction) {
    try {
      const body = userRegisterSchema.parse(req.body);
      const [accessToken, refreshToken] = await this.service.register(body);

      res
      .cookie('refreshToken', refreshToken, {
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200).json({ msg: 'Usuário criado', token: accessToken });
      
    } catch (err) {
      next(err);
    }
  }
}