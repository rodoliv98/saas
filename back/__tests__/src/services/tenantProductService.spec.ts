import { TenantProductsService } from "../../../src/services/tenantProductsService"
import { ITenantProductsRepository } from "../../../src/repository/interfaces/tenantProductsRepoInterface"
import { ProductDTO, IProdutos } from "../../../src/controllers/tenantProductsController";
import { formatProductsData, IFormatProductsData } from "../../../src/utils/formatProductsData";

jest.mock("../../../src/utils/formatProductsData");

const mockedFormatProductsData = jest.mocked(formatProductsData);

describe('TenantProductService', () => {
  let service: TenantProductsService;
  let repo: jest.Mocked<ITenantProductsRepository>;

  beforeEach(() => {
    jest.resetAllMocks();

    repo = {
      create: jest.fn(),
      getProducts: jest.fn(),
      delete: jest.fn(),
      getProductById: jest.fn(),
      patch: jest.fn()
    };

    service = new TenantProductsService(repo);
  });

  function createMockIProdutos (): IProdutos {
    return {
      id: '123',
      nomeProduto: '123',
      descProduto: '123',
      categoria: '123',
      precoProduto: '123',
      tamanho: '123',
      tempoPreparo: '123',
      imageUrl: '123',
      tenantId: '123'
    }
  }

  function createMockProductsDTO (): ProductDTO {
    return {
      categoria: '123',
      descProduto: '123',
      image: '123',
      nomeProduto: '123',
      tamanho: '123',
      tempoPreparo: '123',
      precoProduto: '123',
      tenantId: '123'
    }
  }

  function createFormatProductsData (): IFormatProductsData {
    return {
      id: '123',
      nomeProduto: '123',
      descProduto: '123',
      categoria: '123',
      precoProduto: '123',
      tamanho: '123',
      tempoPreparo: '123',
      imageUrl: '123'
    }
  }
  
  test('getProducts method: 200', async () => {
    const products = createMockIProdutos();
    const formatedProducts = createFormatProductsData();

    repo.getProducts.mockResolvedValueOnce([products]);
    mockedFormatProductsData.mockReturnValueOnce([formatedProducts]);
    const result = await service.getProducts('123');

    expect(repo.getProducts).toHaveBeenCalledWith('123');
    expect(mockedFormatProductsData).toHaveBeenCalledWith([products]);
    expect(result).toEqual([formatedProducts]);
  });

  test('getProducts method: empty arr', async () => {
    repo.getProducts.mockResolvedValueOnce([]);
    await expect(service.getProducts('123')).rejects.toThrow('Nenhum produto cadastrado');

    expect(repo.getProducts).toHaveBeenCalledWith('123');
  });

  test('create method: 200', async () => {
    const product = createMockIProdutos();
    const productDTO = createMockProductsDTO(); 
    
    repo.create.mockResolvedValueOnce(product);
    const result = await service.create(productDTO);

    expect(repo.create).toHaveBeenCalledWith(productDTO);
    expect(result).toEqual(product);
  });

  test('delete method: 200', async () => {
    const product = createMockIProdutos();
    
    repo.delete.mockResolvedValueOnce(product);
    const result = await service.delete('123');

    expect(repo.delete).toHaveBeenCalledWith('123');
    expect(result).toEqual(product);
  });

  test('delete method: product not found', async () => {
    repo.delete.mockResolvedValueOnce(null);
    await expect(service.delete('123')).rejects.toThrow('Produto não encontrado');

    expect(repo.delete).toHaveBeenCalledWith('123');
  })
})