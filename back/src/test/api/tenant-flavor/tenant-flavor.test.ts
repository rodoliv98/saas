import { vi, describe, Mocked, it, beforeEach, Mock, expect } from 'vitest'; 
import { TenantFlavorsService } from "../../../services/tenantFlavorsService";
import { ITenantFlavorsRepository } from "../../../repository/tenantFlavorsRepository";
import { Decimal } from '@prisma/client/runtime/library'; 
import { ErrorCode } from '../../../types/constants/error-codes-constants';
import { CustomError } from '../../../errors/errorHandler';

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
    expect(repo.getFlavors).toHaveBeenCalledWith(mockData.produtoId);
  });

  it('getflavors should be []', async () => {
    repo.getFlavors.mockResolvedValueOnce([]);
    const result = await service.getFlavors('ad123das13asd');

    expect(result).toEqual([]);
    expect(repo.getFlavors).toHaveBeenCalledWith('ad123das13asd');
  });

  it('should return flavor by its id', async () => {
    const mockFlavorId = 'flavor_id';
    const mockProductId = 'product_id';
    const mockFlavor = mockFlavorData();

    repo.getFlavorById.mockResolvedValueOnce(mockFlavor);
    const result = await service.getFlavorById(mockFlavorId, mockProductId);

    expect(result).toEqual(mockFlavor);
    expect(repo.getFlavorById).toHaveBeenCalledWith(mockFlavorId, mockProductId);
  });

  it('flavor should not be found', async () => {
    const mockFlavorId = 'flavor_id';
    const mockProductId = 'product_id';

    repo.getFlavorById.mockResolvedValueOnce(null);
    await expect (service.getFlavorById(mockFlavorId, mockProductId))
      .rejects.toThrow(new CustomError('Nenhum sabor encontrado', 404, ErrorCode.FLAVOR_NOT_FOUND))

    expect(repo.getFlavorById).toHaveBeenCalledWith(mockFlavorId, mockProductId);
  });

  it('should delete flavor', async () => {
    const mockFlavorId = 'flavor_id';
    const mockTenantId = 'tenant_id';
    const mockFlavor = mockFlavorData();

    repo.getFlavorById.mockResolvedValueOnce(mockFlavor);
    const result = await service.delete(mockFlavorId, mockTenantId);

    expect(result).toBe(undefined);
    expect(repo.getFlavorById).toHaveBeenCalledWith(mockFlavorId, mockTenantId);
  })
})
