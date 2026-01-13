export interface RegisterDeliveryManDTO {
  nome_telegram: string;
  tenant_id: string;
  chat_id: bigint;
  codigo_ativacao: string;
};

export type DeliveryManDTO = Omit<RegisterDeliveryManDTO, 'tenant_id'>;