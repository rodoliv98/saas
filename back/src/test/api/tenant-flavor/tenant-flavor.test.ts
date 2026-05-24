import { vi, describe, Mocked, it, beforeEach, Mock, expect } from 'vitest'; 
import { TenantFlavorsService } from "../../../services/tenantFlavorsService";
import { ITenantFlavorsRepository } from "../../../repository/tenantFlavorsRepository";
import { Decimal } from '@prisma/client/runtime/library'; 

describe('FlavorService', () => {
  let service: TenantFlavorsService;
  let repo: Mocked<ITenantFlavorsRepository>;

  beforeEach(() => {
    repo = {
      create: vi.fn(),
      delete: vi.fn(),
      findFlavor: vi.fn(),
      getFlavorById: vi.fn(),
      getFlavors: vi.fn(),
      patch: vi.fn(),
    }

    service = new TenantFlavorsService(repo);
  });

  function mockFlavorData() {
    return {
      id: "prod_8f3k9x2m",
      nomeProduto: "Notebook Dell Inspiron 15",
      descProduto: "processador i7 12ª geração, 16GB RAM",
      categoria: "Eletrônicos",
      precoProduto: new Decimal(4599),
      imageUrl: "https://images.example.com/notebooks/dell-inspiron-15-2025.jpg",
      produtoId: "prod_8f3k9x2m",
      imagePublicId: "notebook_dell_inspiron_15_2025",
      tenantId: "tenant_loja_principal"
    }
  }

  it('Should get all flavors', async () => {
    const mockData = mockFlavorData();
    repo.getFlavors.mockResolvedValueOnce([mockData]);
    const result = await service.getFlavors(mockData.produtoId);

    expect(result).toStrictEqual([mockData]);
  })
})
