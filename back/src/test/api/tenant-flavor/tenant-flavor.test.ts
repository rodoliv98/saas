import { vi, describe, Mocked, it, beforeEach, Mock, expect } from 'vitest'; 
import { TenantFlavorsService } from "../../../api/tenant-flavor/tenantFlavorsService";
import { ITenantFlavorsRepository } from "../../../api/tenant-flavor/tenantFlavorsRepository";
import { Decimal } from '@prisma/client/runtime/library'; 
import { ErrorCode } from '../../../types/constants/error-codes-constants';
import { CustomError } from '../../../errors/errorHandler';
import { uploadImageCloudinary, deleteFromCloudinary } from '../../../integrations/cloudinary/cloudinary-helpers';
import fs from 'fs/promises';

vi.mock('../../../integrations/cloudinary/cloudinary-helpers', () => ({
  uploadImageCloudinary: vi.fn(),
  deleteFromCloudinary: vi.fn()
}));

vi.mock('fs/promises', () => ({
  default: {
    unlink: vi.fn()
  }
}));

const mockedUploadImageCloudinary = vi.mocked(uploadImageCloudinary);
const mockedDeleteFromCloudinary = vi.mocked(deleteFromCloudinary);
const mockFs = vi.mocked(fs.unlink);

describe('FlavorService', () => {
  let service: TenantFlavorsService;7
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

  function returnedValueFromDatabase(overrides = {}) {
    return {
      id: 'asdsa12312sad1234',
      produtoId: 'dsfsdf12312ssa2313',
      nomeProduto: 'Borda de Atum',
      descProduto: 'Borda com Atum',
      categoria: 'borda',
      precoProduto: new Decimal(3000),
      imageUrl: 'http://localhost:3000',
      imagePublicId: 'adsad123213dasd123',
      tenantId: 'asddas123213',
      ...overrides
    }
  }

  function mockCreateFlavorDTO(overrides = {}) {
    return {
      data: {
        nomeProduto: "Notebook Dell Inspiron 15",
        descProduto: "processador i7 12ª geração, 16GB RAM",
        categoria: "Eletrônicos",
        precoProduto: 40.00
      },
      tenantId: "tenant_loja_principal",
      productId: "prod_8f3k9x2m",
      tenantSlug: 'tenant-slug',
      multerImagePath: '/tmp/file',
      ...overrides
    }
  }

  function mockPatchFlavorDTO(overrides = {}) {
    return {
      data: {
        nomeProduto: "Notebook Dell Inspiron 15",
        descProduto: "processador i7 12ª geração, 16GB RAM",
        categoria: "Eletrônicos",
        precoProduto: 40.00
      },
      tenantId: "tenant_loja_principal",
      flavorId: "prod_8f3k9x2m",
      tenantSlug: 'tenant-slug',
      multerImagePath: '/tmp/file',
      ...overrides
    }
  }

  it('Should get all flavors', async () => {
    const mockData = returnedValueFromDatabase();
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
    const flavor = returnedValueFromDatabase();

    repo.getFlavorById.mockResolvedValueOnce(flavor);
    const result = await service.getFlavorById(mockFlavorId, mockProductId);

    expect(result).toEqual(flavor);
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

  it('should create new flavor', async () => {
    const flavorData = mockCreateFlavorDTO();
    const flavor = returnedValueFromDatabase();

    mockedUploadImageCloudinary.mockResolvedValueOnce({
      public_id: 'id-publico-cloudinary',
      url: 'https://cloudinary.com/fake'
    });
    mockFs.mockResolvedValueOnce(undefined);

    repo.create.mockResolvedValueOnce(flavor);
    const result = await service.create(flavorData);

    expect(result).toEqual(flavor);
    expect(mockedUploadImageCloudinary).toHaveBeenCalledWith(
      flavorData.multerImagePath,
      flavorData.tenantSlug
    );
  });

  it('should patch the flavor', async () => {
    const flavorData = mockPatchFlavorDTO();
  })

  it('should delete flavor', async () => {
    const mockFlavorId = 'flavor_id';
    const mockTenantId = 'tenant_id';
    const flavor = returnedValueFromDatabase();

    repo.getFlavorById.mockResolvedValueOnce(flavor);
    const result = await service.delete(mockFlavorId, mockTenantId);

    expect(result).toBe(undefined);
    expect(repo.getFlavorById).toHaveBeenCalledWith(mockFlavorId, mockTenantId);
  })
})
