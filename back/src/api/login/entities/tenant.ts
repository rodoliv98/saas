export type TenantLogin = {
  id: string;
  senha: string;
  tenantSlug: string;
  kind: string;
}

export type TenantRefresh = Pick<TenantLogin, 'id' | 'tenantSlug'>;