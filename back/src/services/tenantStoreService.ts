import { ITenantData } from "../controllers/tenantStoreController";
import { SlugType } from "../types/types-index";
import { CustomError } from "../errors/errorHandler";
import { ITenantStoreRepository } from "../repository/tenantStoreRepository";
import { IFormatStoreData } from "../interfaces/tenant-interfaces/tenant-inter-index";
import { ProductsWithFlavors } from "../api/product/entitie/product-entitie";
import { randomBytes } from "node:crypto";
import { ErrorCode } from "../types/constants/error-codes-constants";

export interface ITenantStoreService {
  getData (slug: SlugType): Promise<IFormatStoreData>;
  isOpen (id: string): Promise<{ isStoreOpen: boolean; storeName: string }>; // criar interface dps
  patchIsOpen (data: boolean, tenantId: string): Promise<ITenantData>;
  createDeliveryCode (tenantSlug: string, tenantId: string): Promise<string>;
}

export class TenantStoreService implements ITenantStoreService {
  constructor (private repo: ITenantStoreRepository) {}

  async getData (slug: SlugType) {
    const tenant = await this.repo.getData(slug);
    if (!tenant) {
      throw new CustomError('Tenant não encontrado', 404, ErrorCode.TENANT_NOT_FOUND);
    }

    const products = await this.repo.getProducts(tenant.id);
    if (!products || products.length === 0) {
      throw new CustomError('Nenhum produto cadastrado nesse tenant', 404, ErrorCode.PRODUCT_NOT_FOUND);
    }

    const formatedData = this.formatStoreData(tenant, products);
    return formatedData;
  }

  async isOpen (id: string) {
    const data = await this.repo.isOpen(id);
    if (!data) {
      throw new CustomError('Dados não encontrados', 404, ErrorCode.NOT_FOUND);
    }

    return { 
      isStoreOpen: data.isOpen, 
      storeName: data.tenantSlug, 
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl
    };
  }

  async patchIsOpen (data: boolean, tenantId: string) {
    return this.repo.patchIsOpen(data, tenantId);
  }

  async createDeliveryCode (tenantSlug: string, tenantId: string) {
    const code = this.createCode(tenantSlug);
    const expireDate = this.createExpireDate();

    const activationCode = {
      code: code,
      tenant_id: tenantId,
      utilizado: false,
      expire_date: expireDate
    }

    await this.repo.createDeliveryCode(activationCode);
    return code;
  }

  private createExpireDate () {
    const now = new Date();
    const FIFTTEEN_MINS_IN_MS = 15 * 60 * 1000; 
    const expireDate = new Date(now.getTime() + FIFTTEEN_MINS_IN_MS);

    return expireDate;
  }

  private createCode (tenantSlug: string) {
    const part1 = randomBytes(2).toString('hex').slice(0, 3).toUpperCase();
    const part2 = randomBytes(2).toString('hex').slice(0, 3).toUpperCase();
    const part3 = randomBytes(2).toString('hex').slice(0, 3).toUpperCase();

    return `${part1}-${part2}-${part3}:${tenantSlug}`;
  }

  private formatStoreData (tenant: ITenantData, products: ProductsWithFlavors[]): IFormatStoreData {
    return {
      store: {
        nomeFantasia: tenant.nomeFantasia,
        nomeEstabelecimento: tenant.nomeEstabelecimento,
        endereco: tenant.endereco,
        isOpen: tenant.isOpen,
        tempoPreparo: tenant.tempoPreparo,
        taxaEntrega: Number(tenant.taxaEntrega),
        whatsapp: tenant.whatsapp,
        logoUrl: tenant.logoUrl,
        bannerUrl: tenant.bannerUrl
      },
      products: products.map(item => ({
        id: item.id,
        nomeProduto: item.nomeProduto,
        descProduto: item.descProduto,
        precoProduto: Number(item.precoProduto),
        categoria: item.categoria,
        imageUrl: item.imageUrl,
        sabores: item.sabores.map(sabor => ({
          id: sabor.id,
          produtoId: sabor.produtoId,
          nomeProduto: sabor.nomeProduto,
          descProduto: sabor.descProduto,
          imageUrl: sabor.imageUrl,
          categoria: sabor.categoria,
          precoProduto: Number(sabor.precoProduto)
        }))
      }))
    }
  }
}