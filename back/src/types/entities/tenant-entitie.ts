import { Decimal } from "../../generated/prisma/internal/prismaNamespace";

export interface Tenant {
  id: string;
  nomeFantasia: string | null;
  razaoSocial: string;
  CNPJ: string;
  inscricaoEstadual: string | null;
  nomeRepresentante: string;
  CPF: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: string;
  estado: string;
  CEP: string;
  tenantSlug: string;
  whatsapp: string;
  diasFuncionamento: string;
  horarioFuncionamento: string;
  tempoPreparo: string;
  taxaEntrega: Decimal;
  isOpen: boolean;
  pin: string | null;
  trial: Date;
}