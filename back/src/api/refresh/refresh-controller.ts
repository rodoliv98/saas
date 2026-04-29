import { Request, Response, NextFunction } from "express";
import { IRefreshService } from "./refresh-service";

export class RefreshController {
  constructor (private service: IRefreshService) {}
  
  async refresh (req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(404).json({ error: 'Token para refresh não encontrado' });
    }

    try {
      const [accessToken, newRefreshToken] = await this.service.refresh(refreshToken);
  
      res
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        secure: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
        path: '/api/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({ msg: 'Tokens atualizados', token: accessToken });

    } catch (err) {
      console.error('Erro no controlador login-controller refresh method:\n', err);
      next(err);
    }
  }

  logout (_req: Request, res: Response, _next: NextFunction) {
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