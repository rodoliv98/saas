import { Request, Response, NextFunction } from "express";
import { ITenantStoreService } from "../services/tenantStoreService";
import { IProdutos } from "./tenantProductsController";
import { slugSchema, tenantIsOpen } from "../schemas/users/user-schemas";
import { Decimal } from "@prisma/client/runtime/library";

export interface ITenantData {
  id: string;
  // passo 1
  nomeFantasia: string | null;
  razaoSocial: string;
  CNPJ: string;
  inscricaoEstadual: string | null;
  // passo 2
  nomeRepresentante: string;
  CPF: string;
  email: string;
  senha: string; // Senha não deve ser retornada
  telefone: string;
  // passo 3
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: string;
  estado: string;
  CEP: string;
  // passo 4
  tenantSlug: string;
  nomeEstabelecimento: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  whatsapp: string;
  diasFuncionamento: string;
  horarioFuncionamento: string;
  tempoPreparo: string;
  taxaEntrega: Decimal;

  // Informações adicionais
  isOpen: boolean;
  pin: string | null;
  produtos?: IProdutos[]
}

export class TenantStoreController {
  constructor (private service: ITenantStoreService) {}

  async getData (req: Request, res: Response, next: NextFunction) {
    console.log('headers', req.headers);
    try {
      const slug = slugSchema.parse(req.params.slug);
      const data = await this.service.getData(slug);

      res.status(200).json(data);

    } catch (err) {
      next(err);
    }
  }

  async isOpen (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenant;
      if (!tenantId) return res.status(401).json({ error: 'Não autorizado' });

      const data = await this.service.isOpen(tenantId);

      res.status(200).json(data);

    } catch (err) {
      next(err);
    }
  }

  async patchIsOpen (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenant;
      if (!tenantId) return res.status(401).json({ error: 'Não autorizado' });
      
      const data = tenantIsOpen.parse(req.body);
      await this.service.patchIsOpen(data.isStoreOpen, tenantId);
      
      res.status(200).json({ msg: 'Status da loja atualizado' });

    } catch (err) {
      next(err);
    }
  }

  async createDeliveryCode (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantSlug = req.slug;
      const tenantId = req.tenant;
      
      if (!tenantSlug || !tenantId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const code = await this.service.createDeliveryCode(tenantSlug, tenantId);

      res.status(200).json({ msg: 'Código criado', code: code })

    } catch (err) {
      next(err);
    }
  }
}