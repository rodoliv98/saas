export type TenantLogin = {
  id: string;
  senha: string;
  tenantSlug: string;
  kind: string;
  active: boolean;
}

export type TenantRefresh = Pick<TenantLogin, 'id' | 'tenantSlug'> & {
  role: 'tenant';
};