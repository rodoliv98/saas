import { Request, Response, NextFunction } from "express"
import { ITenantDataService } from "../services/tenantDataService";
import { patchTenantDataSchema } from "../schemas/users/user-schemas";
import { orderReportSchema } from "../schemas/orders/order-reports";

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

      const body = orderReportSchema.parse(obj);
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
      console.log(parsedData);
      const updatedData = await this.service.patchData(tenantId, parsedData);

      return res.status(200).json(updatedData);

    } catch (err) {
      console.log('Erro no controlador tenant-data-controller getData method:\n', err);
      next(err);
    }
  }
}