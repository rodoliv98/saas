import { Request, Response, NextFunction } from "express";
import { adminLoginSchema } from "./schemas/admin-login-schema";
import { IAdminService } from "./admin-service";

export class AdminController {
  constructor (private service: IAdminService) {}
  
  async login (req: Request, res: Response, next: NextFunction) {
    try {
      const data = adminLoginSchema.parse(req.body);
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
      .json({ msg: 'Admin logado com sucesso', token: accessToken });

    } catch (err) {
      next(err);
    }
  }
}