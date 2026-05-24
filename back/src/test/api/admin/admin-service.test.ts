import { describe, it, beforeEach, expect, vi, Mocked } from 'vitest';
import { AdminService } from '../../../api/admin/admin-service';
import { IAdminRepository } from '../../../api/admin/admin-repo';
import { CustomError } from '../../../errors/errorHandler';
import { ErrorCode } from '../../../types/constants/error-codes-constants';
import { createLoginToken } from '../../../utils/tokenJWT';
import { Decimal } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';

vi.mock('bcrypt');
vi.mock('../../../utils/tokenJWT', () => ({
  createLoginToken: vi.fn(() => ['access', 'refresh'])
}));

describe('AdminService', () => {
  let service: AdminService;
  let repoMock: Mocked<IAdminRepository>;

  beforeEach(() => {
    repoMock = {
      login: vi.fn(),
      findAllTenants: vi.fn(),
      findTenant: vi.fn(),
      changeStoreStatus: vi.fn(),
      changeStoreActiveStatus: vi.fn()
    };
    service = new AdminService(repoMock);
    (createLoginToken as any).mockClear();
  });

  function mockAllTenantData() {
    return {
      id: '1', 
      tenantSlug: 'slug', 
      isOpen: true,
      active: true,
      horarioFuncionamento: '18:00-22:00',
      diasFuncionamento: '[seg,ter,qua]'
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

  it('should throw if admin not found', async () => {
    repoMock.login.mockResolvedValue(null);
    await expect(service.login({ email: 'admin@a.com', senha: '123' }))
      .rejects.toThrow(new CustomError('Credenciais inválidas', 404, ErrorCode.ADMIN_BAD_REQUEST));
  });

  it('should throw if password does not match', async () => {
    repoMock.login.mockResolvedValue({ id: '1', senha: 'hash', email: 'test@email.com' });
    vi.mocked(bcrypt.compare).mockImplementation(() => Promise.resolve(false));
    await expect(service.login({ email: 'admin@a.com', senha: '123' }))
      .rejects.toThrow(new CustomError('Credenciais inválidas', 404, ErrorCode.ADMIN_BAD_REQUEST));
  });

  it('should return tokens for valid admin', async () => {
    repoMock.login.mockResolvedValue({ id: '1', senha: 'hash', email: 'test@email.com' });
    vi.mocked(bcrypt.compare).mockImplementation(() => Promise.resolve(true));
    const result = await service.login({ email: 'admin@a.com', senha: '123' });
    expect(result).toEqual(['access', 'refresh']);
    expect(createLoginToken).toHaveBeenCalledWith('1', 'adminId', 'admin');
  });

  it('should return all tenants', async () => {
    const mockTenant = mockAllTenantData();
    repoMock.findAllTenants.mockResolvedValue([mockTenant]);
    const tenants = await service.findAllTenants();
    expect(tenants).toEqual([mockTenant]);
  });

  it('should throw if tenant not found on changeStoreStatus', async () => {
    repoMock.findTenant.mockResolvedValue(null);
    await expect(service.changeStoreStatus('1', true))
      .rejects.toThrow(new CustomError('Tenant não encontrado na rota de admin', 404, ErrorCode.TENANT_NOT_FOUND));
  });

  it('should change store status if tenant exists', async () => {
    const mockTenant = mockTenantData();
    repoMock.findTenant.mockResolvedValue(mockTenant);
    (repoMock.changeStoreStatus as any).mockResolvedValue({ id: '1', isOpen: true });
    const result = await service.changeStoreStatus('1', true);
    expect(result).toEqual({ id: '1', isOpen: true });
  });
});
