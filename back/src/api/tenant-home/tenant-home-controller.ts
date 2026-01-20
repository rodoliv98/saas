import { Request, Response, NextFunction } from "express";
import { TenantHomeService } from "./tenant-home-service";

export class TenantHomeController {
  constructor (private service: TenantHomeService) {}
  
  async getHomeData (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenant;
      if (!tenantId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const tenantSlug = req.slug;
      if (!tenantSlug) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const data = await this.service.getHomeData(tenantId, tenantSlug);

      res.status(200).json(data);

    } catch (err) {
      next(err);
    }
  }
}