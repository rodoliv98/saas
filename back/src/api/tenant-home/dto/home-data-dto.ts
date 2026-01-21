export interface HomeDataDTO {
  tenant: string;
  planType: string | undefined;
  ordersQuantity: number;
  timeRemaining: Date;
  totalValue: number;
}