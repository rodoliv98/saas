import { vi, Mocked, describe, it, beforeEach, expect, afterEach } from 'vitest';
import { RegisterService } from "../../../api/register/register-service";
import { IRegisterRepository } from "../../../api/register/register-repo";
import { Decimal } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';

vi.mock('bcrypt');
const mockFetch = vi.fn();

describe('RegisterService', () => {
  let service: RegisterService;
  let repoMock: Mocked<IRegisterRepository>;

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.fake/webhook';
    
    repoMock = {
      register: vi.fn()
    }

    service = new RegisterService(repoMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.DISCORD_WEBHOOK_URL;
  })

  function mockRegisterData() {
    return {
      // passo 1
      nomeFantasia: 'Burger Top',
      razaoSocial: 'Burger Top Restaurantes Ltda',
      inscricaoEstadual: '123.456.789',
      CNPJ: '12.345.678/0001-99',
      // passo 2
      nomeRepresentante: 'João Silva',
      CPF: '123.456.789-00',
      email: 'joao@burgertop.com',
      senha: 'Senha@12345',
      telefone: '(21) 99999-9999',
      // passo 3
      CEP: '25.000-000',
      bairro: 'Centro',
      municipio: 'Duque de Caxias',
      complemento: 'Sala um',
      endereco: 'Rua das Flores',
      numero: '123',
      estado: 'RJ',
      // passo 4
      tenantSlug: 'burger-top',
      nomeEstabelecimento: 'Burger Top',
      diasFuncionamento: ['seg', 'ter', 'qua', 'qui', 'sex'],
      horarioFuncionamento: '08:00-22:00',
      tempoPreparo: '30',
      taxaEntrega: 5.00,
      whatsapp: '(21) 99999-9999',
    }
  }

  function mockTenantData() {
    return {
      id: 'cuid_fake_123',
      nomeFantasia: 'Burger Top',
      razaoSocial: 'Burger Top Ltda',
      CNPJ: '12.345.678/0001-99',
      inscricaoEstadual: '123.456.789.000',
      nomeRepresentante: 'João Silva',
      nomeEstabelecimento: 'burger-top',
      CPF: '123.456.789-00',
      email: 'joao@burgertop.com',
      senha: 'hashed_senha_fake',
      telefone: '(21) 99999-9999',
      endereco: 'Rua das Flores',
      numero: '123',
      complemento: 'Sala 1',
      bairro: 'Centro',
      municipio: 'Duque de Caxias',
      estado: 'RJ',
      CEP: '25000-000',
      tenantSlug: 'burger-top',
      whatsapp: '(21) 99999-9999',
      diasFuncionamento: 'Segunda a Sexta',
      horarioFuncionamento: '08:00 - 22:00',
      tempoPreparo: '30 minutos',
      taxaEntrega: new Decimal('5.00'),
      isOpen: false,
      pin: '123456',
      trial: new Date('2025-12-31'),
      active: true,
      logoUrl: 'https://res.cloudinary.com/fake/logo.png',
      logoPublicId: 'fake/logo',
      bannerUrl: 'https://res.cloudinary.com/fake/banner.png',
      bannerPublicId: 'fake/banner',
    }
  }

  function mockDataToRegister(
    registerData: any, 
    diasFuncionamento: string, 
    password: string
  ) {
    return {
      registerData,
      diasFuncionamento,
      password
    }
  }

  it('Should register account', async () => {
    const mockData = mockRegisterData();
    const mockTenant = mockTenantData();
    const string = JSON.stringify(mockData.diasFuncionamento);
    
    vi.mocked(bcrypt.hash).mockImplementation(() => Promise.resolve('hashed_password'));
    repoMock.register.mockResolvedValueOnce(mockTenant);

    const mockCreateTenantData = mockDataToRegister(mockData, string, 'hashed_password');
    mockFetch.mockResolvedValueOnce({ ok: true });
    const result = await service.register(mockData);
    
    expect(result).toEqual(mockTenant);
    expect(repoMock.register).toHaveBeenCalledWith(mockCreateTenantData);
  })

  it('should throw error when notify discord', async () => {
    const mockData = mockRegisterData();
    const mockTenant = mockTenantData();
    const string = JSON.stringify(mockData.diasFuncionamento);
    
    vi.mocked(bcrypt.hash).mockImplementation(() => Promise.resolve('hashed_password'));
    repoMock.register.mockResolvedValueOnce(mockTenant);

    const mockCreateTenantData = mockDataToRegister(mockData, string, 'hashed_password');
    mockFetch.mockResolvedValueOnce({ ok: false });
    const result = await service.register(mockData);
    
    expect(result).toEqual(mockTenant);
    expect(repoMock.register).toHaveBeenLastCalledWith(mockCreateTenantData);
  })
})