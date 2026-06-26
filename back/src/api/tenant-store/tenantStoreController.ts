import { Request, Response, NextFunction } from "express";
import { ITenantStoreService } from "./tenantStoreService";
import { slugSchema, tenantIsOpen } from "../../schemas/users/user-schemas";

export class TenantStoreController {
  constructor (private service: ITenantStoreService) {}

  async getData (req: Request, res: Response, next: NextFunction) {
    try {
      const slug = slugSchema.parse(req.params.slug);
      const data = await this.service.getData(slug);

      res.status(200).json(data);

    } catch (err) {
      next(err);
    }
  }

  async isOpen (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenant;
      if (!tenantId) return res.status(401).json({ error: 'Não autorizado' });

      const data = await this.service.isOpen(tenantId);

      res.status(200).json(data);

    } catch (err) {
      next(err);
    }
  }

  async patchIsOpen (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenant;
      if (!tenantId) return res.status(401).json({ error: 'Não autorizado' });
      
      const data = tenantIsOpen.parse(req.body);
      await this.service.patchIsOpen(data.isStoreOpen, tenantId);
      
      res.status(200).json({ msg: 'Status da loja atualizado' });

    } catch (err) {
      next(err);
    }
  }

  async createDeliveryCode (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantSlug = req.slug;
      const tenantId = req.tenant;
      
      if (!tenantSlug || !tenantId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const code = await this.service.createDeliveryCode(tenantSlug, tenantId);

      res.status(200).json({ msg: 'Código criado', code: code })

    } catch (err) {
      next(err);
    }
  }
}