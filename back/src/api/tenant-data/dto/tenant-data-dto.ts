import { z } from "zod";
import { patchTenantDataSchema } from "../schemas/tenant-data-schema";

export interface TenantDataStrDTO {
  diasFuncionamento: string; // <- service faz stringfy nisso aqui
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: string;
  estado: string;
  whatsapp: string;
  horarioFuncionamento: string;
  tempoPreparo: string;
  pin: string;
}

export type TenantDataDTO = z.infer<typeof patchTenantDataSchema>;
