import { RegisterService } from "../../../src/services/registerService";
import { IRegisterRepository } from "../../../src/repository/registerRepository";
import { ITenantData } from "../../../src/controllers/tenantStoreController";
import { RegisterType } from "../../../src/controllers/registerController";
import { apiCompare } from "../../../src/utils/apiCompare";
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));
jest.mock("../../../src/utils/apiCompare");

const mockBcrypt = bcrypt as any;
const mockApiCompare = jest.mocked(apiCompare);

describe('RegisterService', () => {
  let service: RegisterService;
  let repo: jest.Mocked<IRegisterRepository>;

  beforeEach(() => {
    jest.resetAllMocks();

    repo = {
      register: jest.fn()
    };

    service = new RegisterService(repo);
  });

  function createMockRegisterType (overrides = {}): RegisterType {
    return {
      nomeFantasia: '123',
      razaoSocial: '123',
      inscricaoEstadual: '123',
      CNPJ: '123',
      nomeRepresentante: '123',
      CPF: '123',
      email: '123',
      senha: '123',
      telefone: '123',
      CEP: '123',
      bairro: '123',
      municipio: '123',
      complemento: '123',
      endereco: '123',
      numero: '123',
      estado: '123',
      tenantSlug: '123',
      diasFuncionamento: ['123'],
      horarioFuncionamento: '123',
      tempoPreparo: '123',
      whatsapp: '123'
    }
  };

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

  test('Register method: 200', async () => {
    const registerData = createMockRegisterType();
    const tenant = createMockTenantData();

    repo.register.mockResolvedValueOnce(tenant);
    mockBcrypt.hash.mockResolvedValueOnce('123');
    const result = await service.register(registerData);

    expect(repo.register).toHaveBeenCalledWith(registerData, "[\"123\"]", '123');
    expect(mockBcrypt.hash).toHaveBeenCalledWith(registerData.senha, 10);
    expect(mockApiCompare).toHaveBeenCalledWith(registerData);
    expect(result).toEqual(tenant);
  });

  test('Register method: data.status == Error', async () => {
    const registerData = '123';
    const tenant = createMockTenantData();

    repo.register.mockResolvedValueOnce(tenant);
    mockBcrypt.hash.mockResolvedValueOnce('123');
    await expect(mockApiCompare)
  })
})