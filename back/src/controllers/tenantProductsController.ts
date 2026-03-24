import { Request, Response, NextFunction } from "express"
import { ITenantProductsService } from "../services/tenantProductsService";
import { checkIfHasImage } from "../utils/checkIfHasImage";
import { createProductSchema } from "../schemas/products/products-schemas";
import { cuidSchema } from "../schemas/products/products-schemas";
import { Decimal } from "@prisma/client/runtime/library";

export interface IProdutos { // <- interface de objeto que vem do db
  id: string;
  nomeProduto: string;
  descProduto: string;
  categoria: string;
  precoProduto: Decimal; // <- tipo é transformado em decimal ao introduzir no db
  imageUrl: string;
  imagePublicId: string | null;
  tenantId: string;
}

export interface ProdutosWSabores { // <- interface de objeto que vem do db
  id: string;
  nomeProduto: string;
  descProduto: string;
  categoria: string;
  precoProduto: Decimal; // <- tipo é transformado em decimal ao introduzir no db
  imageUrl: string;
  tenantId: string;
  sabores: {
    id: string;
    produtoId: string;
    nomeProduto: string;
    descProduto: string;
    imageUrl: string;
    categoria: string;
    precoProduto: Decimal;
  }[]
}

export interface ProductDTO {
  categoria: string;
  descProduto: string;
  nomeProduto: string;
  precoProduto: number;
  tenantId: string;
  imagePath: string;
}

export interface IPatchProductDTO {
  categoria?: string;
  descProduto?: string;
  imagePath?: string;
  nomeProduto?: string;
  precoProduto?: number;
}

export class TenantProductsController {
  constructor(private service: ITenantProductsService) {}

  async getProducts (req: Request, res: Response, next: NextFunction) {
    const id = req.tenant;
    if (!id) return res.status(400).json({ error: 'Não autorizado' });

    try {
      const products = await this.service.getProducts(id);

      res.status(200).json(products);

    } catch (err) {
      console.log('Erro no controlador tenant-products-controller getProducts method:\n', err);
      next(err);
    }
  }

  async getProductById (req: Request, res: Response, next: NextFunction) {
    try {
      const productId = cuidSchema.parse(req.params.id);
      if (!productId) return res.status(400).json({ error: 'Id do produto não encontrado' });
  
      const tenantId = req.tenant;
      if (!tenantId) return res.status(401).json({ error: 'Não autorizado' });
      
      const product = await this.service.getProductById(productId, tenantId);

      res.status(200).json(product);

    } catch (err) {
      console.log('Erro no controlador tenant-products-controller getProductById method:\n', err);
      next(err);
    }
  }
  
  async create (req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenant;
      if (!tenantId) return res.status(401).json({ error: 'Não autorizado' });
      
      const imagePath = req.file?.path;
      if (!imagePath) return res.status(400).json({ error: 'Nenhuma imagem encontrada' });
      // preço vem como string por causa do formData
      // usando decimal no prisma
      const body = req.body;
      body.precoProduto = Number(body.precoProduto);

      const data = createProductSchema.parse(body);
      const newProduct = { ...data, imagePath: imagePath, tenantId: tenantId };
      await this.service.create(newProduct);
      
      res.status(200).json({ msg: 'Produto criado com sucesso!' });

    } catch (err) {
      console.log('Erro no controlador tenant-products-controller create method:\n', err);
      next(err);
    }
  }

  async patch (req: Request, res: Response, next: NextFunction) {
    const tenantId = req.tenant;
    if (!tenantId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    
    try {
      const productId = cuidSchema.parse(req.params.id);
      // preço vem como string por causa do formData
      // usando decimal no prisma
      const body = req.body;
      body.precoProduto = Number(body.precoProduto);

      const parsedBody = createProductSchema.parse(body);
      // const data = await checkIfHasImage(req.file?.path, body);

      const patchProduct = {
        ...parsedBody,
        tenantId,
        productId,
        multerImagePath: req.file?.path
      }

      await this.service.patch(patchProduct);

      res.status(200).json({ msg: 'Produto atualizado' });

    } catch (err) {
      console.log('Erro no controlador tenant-products-controller patch method:\n', err);
      next(err);
    }
  }

  async delete (req: Request, res: Response, next: NextFunction) {
    try {
      const id = cuidSchema.parse(req.params.id);
      if (!id) return res.status(400).json({ error: 'Id do produto não encontrado' });
      
      const tenantId = req.tenant;
      if (!tenantId) return res.status(401).json({ error: 'Não autorizado' });

      await this.service.delete(id, tenantId);
      res.status(200).json({ msg: 'Produto deletado com sucesso' });

    } catch (err) {
      console.log('Erro no controlador tenant-products-controller delete method:\n', err);
      next(err);
    }
  }
}