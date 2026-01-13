import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { IUserRegisterService } from "../services/user-register-service";
import { userRegisterSchema } from "../schemas/users/user-schemas";

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
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200).json({ msg: 'Usuário criado', token: accessToken });
      
    } catch (err) {
      console.log('Erro no controlador user-register-controller\n', err);
      if (err instanceof ZodError) next(err);
      next(err);
    }
  }
}