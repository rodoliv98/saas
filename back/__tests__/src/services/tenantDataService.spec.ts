import { TenantDataService } from "../../../src/services/tenantDataService"
import { formatTenantData, IFormatTenantData } from "../../../src/utils/formatTenantData"
import { ITenantDataRepository } from "../../../src/repository/interfaces/tenantDataRepoInterface"
import { ITenantData, ITenantPatchData } from "../../../src/controllers/tenantStoreController";

jest.mock("../../../src/utils/formatTenantData");

const mockFormatData = jest.mocked(formatTenantData);

describe('TenantDataService', () => {
  let service: TenantDataService;
  let repo: jest.Mocked<ITenantDataRepository>;

  beforeEach(() => {
    jest.resetAllMocks();

    repo = {
      getData: jest.fn(),
      patchData: jest.fn()
    };

    service = new TenantDataService(repo);
  });

  function createMockTenantData (): ITenantData {
    return {
      id: '123',
      nomeFantasia: '123',
      razaoSocial: '123',
      CNPJ: '123',
      inscricaoEstadual: '123',
      nomeRepresentante: '123',
      CPF: '123',
      email: '123',
      senha: '123',
      telefone: '123',
      endereco: '123',
      numero: '123',
      complemento: '123',
      bairro: '123',
      municipio: '123',
      estado: '123',
      CEP: '123',
      tenantSlug: '123',
      whatsapp: '123',
      diasFuncionamento: '123',
      horarioFuncionamento: '123',
      tempoPreparo: '123',
      admin: true,
      isOpen: true,
    }
  }

  function createMockFormatedData (): IFormatTenantData {
    return {
      endereco: '123',
      numero: '123',
      complemento: '123',
      bairro: '123',
      municipio: '123',
      estado: '123',
      CEP: '123',
      whatsapp: '123',
      diasFuncionamento: '123',
      horarioFuncionamento: '123',
      tempoPreparo: '123'
    }
  }

  function createMockITenantPatchData (): ITenantPatchData {
    return {
      CEP: '123',
      bairro: '123',
      municipio: '123',
      complemento: '123',
      estado: '123',
      diasFuncionamento: ['123'],
      endereco: '123',
      horarioFuncionamento: '123',
      numero: '123',
      whatsapp: '123',
      tempoPreparo: '123'
    }
  }

  test('getData method: 200', async () => {
    const tenantData = createMockTenantData();
    const formatData = createMockFormatedData();

    repo.getData.mockResolvedValueOnce(tenantData);
    mockFormatData.mockReturnValueOnce(formatData);
    const result = await service.getData('123');

    expect(repo.getData).toHaveBeenCalledWith('123');
    expect(mockFormatData).toHaveBeenCalledWith(tenantData);
    expect(result).toEqual(formatData);
  });

  test('getData method: estabelecimento não encontrado', async () => {
    repo.getData.mockResolvedValueOnce(null);
    await expect(service.getData('123')).rejects.toThrow('Estabelecimento não encontrado');

    expect(repo.getData).toHaveBeenCalledWith('123');
  });

  test('patchData method: 200', async () => {
    const data = createMockITenantPatchData();
    const string = JSON.stringify(data.diasFuncionamento);
    const dataToCallDB = { ...data, diasFuncionamento: string };
    const formatData = createMockFormatedData();
    const tenant = createMockTenantData();

    repo.patchData.mockResolvedValueOnce(tenant);
    mockFormatData.mockReturnValueOnce(formatData);
    const result = await service.patchData('123', data);

    expect(repo.patchData).toHaveBeenCalledWith('123', dataToCallDB);
    expect(mockFormatData).toHaveBeenCalledWith(tenant);
    expect(result).toEqual(formatData);
  });

  test('patchData method: estabelecimento não encontrado', async () => {
    const data = createMockITenantPatchData();
    const string = JSON.stringify(data.diasFuncionamento);
    const dataToCallDB = { ...data, diasFuncionamento: string };

    repo.patchData.mockResolvedValueOnce(null);
    await expect(service.patchData('123', data)).rejects.toThrow('Estabelecimento não encontrado');

    expect(repo.patchData).toHaveBeenCalledWith('123', dataToCallDB);
  })
})