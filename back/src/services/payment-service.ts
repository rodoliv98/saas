import { CustomError } from "../middlewares/errorHandler";
import { PaymentRepository } from "../repository/payment-repository";
import { ErrorCode } from "../types/constants/error-codes-constants";
import { AllowedPlans } from "../types/dtos/payment-create-dto"
import { AbacateChargeResponse } from "../types/externals/abacate/qr-code-creation";
import { AnyPlan } from "../types/types-index";

export class PaymentService {
  constructor (private repo: PaymentRepository) {}
  
  async createPayment (planChoice: AllowedPlans) {
    const planFound = await this.repo.findPlan(planChoice);
    if (!planFound) {
      throw new CustomError('Plano não encontrado', 404, ErrorCode.PLAN_NOT_FOUND);
    }

    const charge = await this.abacateApiCall(planFound);
    /* await this.repo.createCharge(charge);
    await this.repo.createChargeLog(charge); */
    // rever as verdadeiras respostas da api do abacate em prod
    
    return charge;
  }
  // trocar o anyplan dps para ser union type
  async abacateApiCall (plan: AnyPlan): Promise<AbacateChargeResponse> {
    const res = await fetch('https://api.abacatepay.com/v1/pixQrCode/create', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY_ABACATE}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: plan.price.monthly.price,
        expiresIn: 900, // tem que converter data pra gmt -3
        description: 'Assinatura do Plano Básico da Automatizai' 
      })
    });

    if (!res.ok) {
      console.log(res);
      throw new CustomError('Erro na resposta do Abacate', 502, ErrorCode.ABACATE.CHARGE_CREATE);
    }
    // da api vem gmt 0 e eu preciso gmt -3 nos timestamps
    const abacateCharge = await res.json();
    const charge = this.covertAbacateTimestamps(abacateCharge);

    return charge
  }

  covertAbacateTimestamps (abacateCharge: AbacateChargeResponse) {
    const createdAtDateObject = new Date(abacateCharge.data.createdAt);
    const updatedAtDateObject = new Date(abacateCharge.data.updatedAt);
    const expiresAtDateObject = new Date(abacateCharge.data.expiresAt);

    const createdGmtMinusThree = new Date(createdAtDateObject.getTime() - 10800000);
    const updatedGmtMinusThree = new Date(updatedAtDateObject.getTime() - 10800000);
    const expiresGmtMinusThree = new Date(expiresAtDateObject.getTime() - 10800000);

    return {
      ...abacateCharge,
      data: {
        ...abacateCharge.data,
        createdAt: createdGmtMinusThree,
        updatedAt: updatedGmtMinusThree,
        expiresAt: expiresGmtMinusThree
      }
    }
  }
}