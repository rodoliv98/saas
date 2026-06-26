import { describe, it, vi, beforeEach, Mocked, expect } from 'vitest';
import { TenantProductsService } from "../../../api/product/tenantProductsService";
import { ITenantProductsRepository } from "../../../api/product/tenantProductsRepository";
import { Decimal } from '@prisma/client/runtime/library';

describe('ProductsService', () => {
  let service: TenantProductsService;
  let repoMock: Mocked<ITenantProductsRepository>;

  beforeEach(() => {
    repoMock = {
      create: vi.fn(),
      delete: vi.fn(),
      getProductById: vi.fn(),
      getProducts: vi.fn(),
      patch: vi.fn(),
    }

    service = new TenantProductsService(repoMock);
  });

  function mockProdutos() {
    return {
      id: '123213213',
      nomeProduto: 'cachorro quente',
      descProduto: 'pão, salsicha, ketchup',
      categoria: 'lanche',
      precoProduto: new Decimal(20),
      imageUrl: 'http://localhost',
      imagePublicId: 'roqwierjio132131231',
      tenantId: '12321312' 
    }
  }

  it('Should get all products', async () => {
    const id = '3124214wqeqwe231';
    const produto = mockProdutos();

    repoMock.getProducts.mockResolvedValueOnce([produto]);
    const result = await service.getProducts(id);

    expect(result).toMatchObject([{
      id: produto.id,
    }]);
  })
})