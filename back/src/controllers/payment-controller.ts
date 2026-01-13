import { Request, Response, NextFunction } from "express";
import { allowedPlans, paymentSchema } from "../schemas/payments/payment-create";
import { PaymentService } from "../services/payment-service";

export class PaymentController {
  constructor (private service: PaymentService) {}

  async createPayment (req: Request, res: Response, next: NextFunction) {
    /*const tenantId = req.tenant;
    if (!tenantId) {
      return res.status(400).json({ error: 'ID do tenant não encontrado' });
    }*/

    try {
      const planChoice = allowedPlans.parse(req.body.plan);

      const charge = await this.service.createPayment(planChoice);

      res.status(200).json(charge);

    } catch (err) {
      console.log(err);
      // ainda precisa terminar isso daqui
      next(err);
    }
  }
}