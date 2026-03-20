export interface HomeDataDTO {
  tenant: string;
  tenantSlug: string;
  planType: string | undefined;
  ordersQuantity: number;
  timeRemaining: Date;
  totalValue: number;
}