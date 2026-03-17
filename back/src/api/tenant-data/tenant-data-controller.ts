import { Request, Response, NextFunction } from "express";
import { ITenantDataService } from "./tenant-data-service";
import { patchTenantDataSchema } from "./schemas/tenant-data-schema";
import { tenantReportSchema } from "./schemas/tenant-reports-schema";

export class TenantDataController {
  constructor (private service: ITenantDataService) {}

  async getData (req: Request, res: Response, next: NextFunction) {
    const tenantId = req.tenant;
    if (!tenantId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    
    try {
      const tenantData = await this.service.getData(tenantId);

      return res.status(200).json(tenantData);

    } catch (err) {
      console.log('Erro no controlador tenant-data-controller getData method:\n', err);
      next(err);
    }
  }

  async getOrders (req: Request, res: Response, next: NextFunction) {
    const tenantSlug = req.slug;
    if (!tenantSlug) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    
    try {
      const obj = {
        year: Number(req.query.year),
        month: Number(req.query.month),
        status: req.query.status
      }

      const body = tenantReportSchema.parse(obj);
      const orders = await this.service.getOrders(tenantSlug, body);

      res.status(200).json({ orders: orders });

    } catch (err) {
      console.log('Erro no controlador tenant-data-controller getOrders method:\n', err);
      next(err);
    }
  }

  async patchData (req: Request, res: Response, next: NextFunction) {
    const tenantId = req.tenant;
    if (!tenantId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    
    try {
      const parsedData = patchTenantDataSchema.parse(req.body);
      const updatedData = await this.service.patchData(tenantId, parsedData);

      return res.status(200).json(updatedData);

    } catch (err) {
      console.log('Erro no controlador tenant-data-controller getData method:\n', err);
      next(err);
    }
  }

  async addLogo (req: Request, res: Response, next: NextFunction) {
    const tenantId = req.tenant;
    if (!tenantId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const logoUrl = req.file?.path;
    if (!logoUrl) {
      return res.status(400).json({ error: 'Imagem não enviada' });
    }

    try {
      await this.service.addLogo(tenantId, logoUrl);

      res.status(200).json({ message: 'Logo adicionada com sucesso' });

    } catch (err) {
      console.log('Erro no controlador tenant-data-controller addLogo method:\n', err);
      next(err);      
    }
  }
}