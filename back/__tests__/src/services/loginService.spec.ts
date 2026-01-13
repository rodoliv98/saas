import { LoginService } from "../../../src/services/loginService"
import { ILoginRepository } from "../../../src/repository/interfaces/loginRepoInterface"
import { createLoginToken, verifyToken } from "../../../src/utils/tokenJWT"
import { ITenantData } from "../../../src/controllers/tenantStoreController"
import { LoginDTO } from "../../../src/controllers/loginController"
import bcrypt from 'bcrypt'

jest.mock("../../../src/utils/tokenJWT");
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

const mockCreateLoginToken = jest.mocked(createLoginToken);
const mockVerifyToken = jest.mocked(verifyToken);
const mockBcrypt = bcrypt as any;

describe('LoginService tests', () => {
  let service: LoginService;
  let repo: jest.Mocked<ILoginRepository>;

  beforeEach(() => {
    jest.resetAllMocks();

    repo = {
      login: jest.fn(),
      refresh: jest.fn(),
    };

    service = new LoginService(repo);
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

  function createMockData (): LoginDTO {
    return {
      email: '123',
      senha: '123'
    }
  }

  test('Login method: 200', async () => {
    const tenant = createMockTenantData();
    const data = createMockData();
    const [token1, token2] = ['123', '123'];

    repo.login.mockResolvedValueOnce(tenant);
    mockBcrypt.compare.mockResolvedValueOnce(true);
    mockCreateLoginToken.mockReturnValueOnce([token1, token2]);
    const result = await service.login(data);

    expect(repo.login).toHaveBeenCalledWith(data);
    expect(mockBcrypt.compare).toHaveBeenCalledWith(data.senha, tenant.senha);
    expect(mockCreateLoginToken).toHaveBeenCalledWith(tenant.id, tenant.admin);
    expect(result).toEqual([token1, token2]);
  });

  test('Login method: usuário não encontrado', async () => {
    const data = createMockData();

    repo.login.mockResolvedValueOnce(null);
    await expect(service.login(data)).rejects.toThrow('Nenhum usuário encontrado com esse emai');

    expect(repo.login).toHaveBeenCalledWith(data);
  });

  test('Login method: email/senha inválido', async () => {
    const tenant = createMockTenantData();
    const data = createMockData();

    repo.login.mockResolvedValueOnce(tenant);
    mockBcrypt.compare.mockResolvedValueOnce(false);
    await expect(service.login(data)).rejects.toThrow('Email ou senha inválida');

    expect(repo.login).toHaveBeenCalledWith(data);
  });

  test('Refresh method: 200', async () => {
    const decodedToken = { tenantId: '123' };
    const tenant = createMockTenantData();
    const [token1, token2] = ['123', '123'];

    repo.refresh.mockResolvedValueOnce(tenant);
    mockVerifyToken.mockReturnValueOnce(decodedToken);
    mockCreateLoginToken.mockReturnValueOnce([token1, token2]);
    const result = await service.refresh('123');

    expect(repo.refresh).toHaveBeenCalledWith(decodedToken.tenantId);
    expect(mockVerifyToken).toHaveBeenCalledWith(token1);
    expect(mockCreateLoginToken).toHaveBeenCalledWith(tenant.id, tenant.admin);
    expect(result).toEqual([token1, token2]);
  });

  test('Refresh method: usuário não encontrado', async () => {
    repo.refresh.mockResolvedValueOnce(null);
    mockVerifyToken.mockReturnValueOnce({ tenantId: '123' });
    await expect(service.refresh('123')).rejects.toThrow('Usuário não encontrado');

    expect(repo.refresh).toHaveBeenCalledWith('123');
    expect(mockVerifyToken).toHaveBeenCalledWith('123');
  });
})