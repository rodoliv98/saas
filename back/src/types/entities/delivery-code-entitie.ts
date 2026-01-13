export interface DeliveryCode {
  id: string;
  codigo: string;
  tenant_id: string;
  utilizado: boolean;
  created_at: Date;
  usado_em: Date | null;
  expire_date: Date;
}