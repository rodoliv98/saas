import { Request, Response, NextFunction } from "express";
import { IOrdersService } from "./ordersService";
import { cuidSchema } from "../../schemas/products/products-schemas";
import { orderSchema } from "../../schemas/orders/order-schemas";
import { orderStatusSchema } from "./schemas/order-schema";

export class OrdersController {
  constructor (private service: IOrdersService) {}

  async getOrders (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantSlug = req.slug;
      if (!tenantSlug) return res.status(401).json({ error: 'Não autorizado' });

      const orders = await this.service.getOrders(tenantSlug);

      res.status(200).json({ orders: orders });

    } catch (err) {
      next(err);
    }
  }

  async patchOrders (req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = cuidSchema.parse(req.params.orderId);
      if (!orderId) return res.status(400).json({ error: 'ID do pedido é obrigatório' });

      const tenantSlug = req.slug;
      if (!tenantSlug) return res.status(401).json({ error: 'Não autorizado' });

      const body = orderStatusSchema.parse(req.body.status);
      await this.service.patchOrders(orderId, body, tenantSlug);

      res.status(200).json({ msg: 'Pedido atualizado' });

    } catch (err) {
      next(err);
    }
  }

  async create (req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user;
      if (!userId) return res.status(401).json({ error: 'Não autorizado' });
      
      const body = orderSchema.parse(req.body);
      await this.service.create(body, userId);

      res.status(200).json({ msg: 'Pedido criado' });
      
    } catch (err) {
      next(err);
    }
  }
}
