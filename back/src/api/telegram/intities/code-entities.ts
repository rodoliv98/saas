export interface ActivationCode {
  tenant_id: string;
  codigo: string;
  expire_date: Date;
  utilizado: boolean;
}