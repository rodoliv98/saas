import { HomeDataDTO } from "./dto/home-data-dto";
import { ITenantHomeRepository } from "./tenant-home-repo";

export interface ITenantHomeService {
  getHomeData (tenantId: string, tenantSlug: string): Promise<HomeDataDTO>; 
}

export class TenantHomeService implements ITenantHomeService {
  constructor (private repo: ITenantHomeRepository) {}
  
  async getHomeData (tenantId: string, tenantSlug: string): Promise<HomeDataDTO> {
    const [tenantData, orders] = await Promise.all([
      this.repo.getHomeData(tenantId),
      this.repo.getHomeOrders(tenantSlug)
    ]);

    const totalValue = orders.reduce(
      (acc, index) => acc + Number(index.totalOrderPrice), 0
    );
    
    const trialTime = tenantData.trial.getTime();
    const planEndTime = tenantData.assinaturas[0]?.endDate?.getTime();

    const planTimeRemaining = planEndTime === undefined
    ? new Date(trialTime)
    : new Date(planEndTime + trialTime);

    const planType = tenantData.assinaturas.length == 0 
    ? 'Plano Básico'
    : tenantData.assinaturas[0].planType as string;

    return {
      tenant: tenantData.nomeRepresentante,
      planType: planType,
      tenantSlug: tenantData.tenantSlug, 
      ordersQuantity: orders.length,
      timeRemaining: planTimeRemaining,
      totalValue: totalValue
    }
  }
}