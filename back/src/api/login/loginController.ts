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
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({ msg: 'Usuário logado com sucesso', token: accessToken });

    } catch (err) {
      console.error('Erro no controlador login-controller login method:\n', err);
      next(err);
    }
  }

  async refresh (req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(404).json({ error: 'refreshToken não encontrado' });
    
    try {
      const [accessToken, newRefreshToken] = await this.service.refresh(refreshToken);
  
      res
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({ msg: 'Tokens atualizados', token: accessToken });

    } catch (err) {
      console.error('Erro no controlador login-controller refresh method:\n', err);
      next(err);
    }
    
  }

  logout (req: Request, res: Response, next: NextFunction) {
    res
    .clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    .status(200)
    .json({ message: 'Logout realizado com sucesso' });
  }
}
