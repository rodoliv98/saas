import { ITenantFlavorsService } from "../services/tenantFlavorsService";
import { Request, Response, NextFunction } from "express";
import { Decimal } from "@prisma/client/runtime/library";
import { createProductSchema, cuidSchema } from "../schemas/products/products-schemas";

export interface IFlavor {
  id: string;
  nomeProduto: string;
  descProduto: string;
  precoProduto: Decimal;
  categoria: string;
  imageUrl: string;
}

export interface FlavorDTO {
  nomeProduto: string;
  descProduto: string;
  precoProduto: number;
  categoria: string;
  imageUrl: string;
}

export interface FlavorHasImage {
  nomeProduto: string;
  descProduto: string;
  precoProduto: number;
  categoria: string;
  imageUrl?: string;
}

export class TenantFlavorsController {
  constructor (private service: ITenantFlavorsService) {}

  async getFlavors (req: Request, res: Response, next: NextFunction) {
    try {
      const productId = cuidSchema.parse(req.params.id);
      const flavors = await this.service.getFlavors(productId);

      res.status(200).json(flavors)

    } catch (err) {
      next(err);
    }
  }

  async getFlavorById (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenant;
      if (!tenantId) return res.status(401).json({ error: 'Não autorizado' });

      const flavorId = cuidSchema.parse(req.params.id);
      const flavor = await this.service.getFlavorById(flavorId, tenantId);

      res.status(200).json(flavor);

    } catch (err) {
      next(err);
    }
  }

  async create (req: Request, res: Response, next: NextFunction) {
    const tenantId = req.tenant;
    if (!tenantId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const tenantSlug = req.slug;
    if (!tenantSlug) {
      return res.status(400).json({ error: 'Slug não configurado' });
    }
    
    try {
      const productId = cuidSchema.parse(req.params.id);
      // front vem como string por causa do formData
      const body = req.body;
      body.precoProduto = Number(body.precoProduto);

      const data = createProductSchema.parse(body);
      const imagePath = req.file?.path;
      
      const createFlavor = {
        data,
        tenantId,
        tenantSlug,
        productId,
        multerImagePath: imagePath
      }

      const flavor = await this.service.create(createFlavor);

      res.status(200).json({ msg: 'Sabor ou item adicional criado', flavor: flavor });

    } catch (err) {
      next(err);
    }
  }

  async patch (req: Request, res: Response, next: NextFunction) {
    const tenantId = req.tenant;
    if (!tenantId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const tenantSlug = req.slug;
    if (!tenantSlug) {
      return res.status(400).json({ error: 'Slug não configurado' });
    }

    try {
      const body = req.body;
      body.precoProduto = Number(body.precoProduto);

      const flavorId = cuidSchema.parse(req.params.id);
      const data = createProductSchema.parse(body);

      const patchData = {
        data,
        flavorId,
        tenantId,
        tenantSlug,
        multerImagePath: req.file?.path
      }

      await this.service.patch(patchData);

      res.status(200).json({ msg: 'Sabor atualizado' });

    } catch (err) {
      next(err);
    }
  }

  async delete (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenant;
      if (!tenantId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const productId = cuidSchema.parse(req.params.id);
      if (!productId) {
        return res.status(400).json({ error: 'Id do produto está faltando' });
      }

      await this.service.delete(productId, tenantId);
      
      res.status(200).json({ msg: 'Sabor deletado' });

    } catch (err) {
      next(err);
    }
  }
}