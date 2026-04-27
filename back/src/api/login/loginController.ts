import { Request, Response, NextFunction } from "express"
import { ILoginService } from "./loginService"; 
import { loginSchema } from "./schemas/login-schema";

export class LoginController {
  constructor (private service: ILoginService) {}
  
  async login (req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const [accessToken, refreshToken] = await this.service.login(data);

      res
      .cookie('refreshToken', refreshToken, {
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        secure: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({ msg: 'Usuário logado com sucesso', token: accessToken });

    } catch (err) {
      next(err);
    }
  }
}
