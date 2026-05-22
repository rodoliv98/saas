import { describe, it, beforeEach, expect, vi, Mocked } from 'vitest';
import { AdminService } from '../../../api/admin/admin-service';
import type { IAdminRepository } from '../../../api/admin/admin-repo';
import { CustomError } from '../../../errors/errorHandler';
import { ErrorCode } from '../../../types/constants/error-codes-constants';

vi.mock('bcrypt', () => ({
  default: { compare: vi.fn() }
}));
import * as bcrypt from 'bcrypt';

vi.mock('../../../utils/tokenJWT', () => ({
  createLoginToken: vi.fn(() => ['access', 'refresh'])
}));
import { createLoginToken } from '../../../utils/tokenJWT';

describe('AdminService', () => {
  let repoMock: Mocked<IAdminRepository>;
  let service: AdminService;

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
    (bcrypt.compare as any).mockClear();
  });

  it('should throw if admin not found', async () => {
    repoMock.login.mockResolvedValue(null);
    await expect(service.login({ email: 'admin@a.com', senha: '123' }))
      .rejects.toThrowError(new CustomError('Credenciais inválidas', 404, ErrorCode.ADMIN_BAD_REQUEST));
  });

  it('should throw if password does not match', async () => {
    (repoMock.login as any).mockResolvedValue({ id: '1', senha: 'hash' });
    (bcrypt.compare as any).mockResolvedValue(false);
    await expect(service.login({ email: 'admin@a.com', senha: '123' }))
      .rejects.toThrowError(new CustomError('Credenciais inválidas', 404, ErrorCode.ADMIN_BAD_REQUEST));
  });

  it('should return tokens for valid admin', async () => {
    (repoMock.login as any).mockResolvedValue({ id: '1', senha: 'hash' });
    (bcrypt.compare as any).mockResolvedValue(true);
    const result = await service.login({ email: 'admin@a.com', senha: '123' });
    expect(result).toEqual(['access', 'refresh']);
    expect(createLoginToken).toHaveBeenCalledWith('1', 'adminId', 'admin');
  });

  it('should return all tenants', async () => {
    (repoMock.findAllTenants as any).mockResolvedValue([{ id: '1', tenantSlug: 'slug', isOpen: true }]);
    const tenants = await service.findAllTenants();
    expect(tenants).toEqual([{ id: '1', tenantSlug: 'slug', isOpen: true }]);
  });

  it('should throw if tenant not found on changeStoreStatus', async () => {
    (repoMock.findTenant as any).mockResolvedValue(null);
    await expect(service.changeStoreStatus('1', true))
      .rejects.toThrowError(new CustomError('Tenant não encontrado na rota de admin', 404, ErrorCode.TENANT_NOT_FOUND));
  });

  it('should change store status if tenant exists', async () => {
    (repoMock.findTenant as any).mockResolvedValue({ id: '1' });
    (repoMock.changeStoreStatus as any).mockResolvedValue({ id: '1', isOpen: true });
    const result = await service.changeStoreStatus('1', true);
    expect(result).toEqual({ id: '1', isOpen: true });
  });
});
