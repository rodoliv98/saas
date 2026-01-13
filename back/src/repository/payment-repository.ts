import { PrismaClient } from "../generated/prisma/client";
import { basicPlanSchema } from "../schemas/plans/plans";
import { AllowedPlans } from "../types/dtos/payment-create-dto";

const prisma = new PrismaClient();

export class PaymentRepository {
  async findPlan (planChoice: AllowedPlans) {
    const plan = await prisma.planos.findUnique({
      where: {
        name: planChoice
      }
    });

    if (plan?.name === 'Básico') {
      return basicPlanSchema.parse(plan);
    }

    return null;
  }
}