import { HomeDataDTO } from "./dto/home-data-dto";
import { TenantHomeRepository } from "./tenant-home-repo";

export class TenantHomeService {
  constructor (private repo: TenantHomeRepository) {}
  
  async getHomeData (tenantId: string, tenantSlug: string): Promise<HomeDataDTO> {
    const [tenantData, orders] = await Promise.all([
      this.repo.getHomeData(tenantId),
      this.repo.getHomeOrders(tenantSlug)
    ]);

    const totalValue = orders.reduce(
      (acc, index) => acc + Number(index.totalOrderPrice), 0
    );
    
    const theTrialTime = tenantData.trial.getTime();
    const thePlanEndTime = tenantData.assinaturas[0]?.endDate?.getTime();

    const planTimeRemaining = thePlanEndTime === undefined
    ? new Date(theTrialTime)
    : new Date(thePlanEndTime + theTrialTime);

    const planType = tenantData.assinaturas.length <= 0 
    ? 'Plano Básico'
    : tenantData.assinaturas[0].planType;

    return {
      tenant: tenantData.nomeRepresentante,
      planType: planType, 
      ordersQuantity: orders.length,
      timeRemaining: planTimeRemaining,
      totalValue: totalValue
    }
  }
}