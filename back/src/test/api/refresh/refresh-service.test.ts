import { beforeEach, describe, it, vi, Mock, type Mocked, expect } from "vitest";
import { RefreshService } from "../../../api/refresh/refresh-service";
import { IRefreshRepository } from "../../../api/refresh/refresh-repo";
import { verifyToken, createLoginToken } from "../../../utils/tokenJWT";

vi.mock("../../../utils/tokenJWT", () => ({
  verifyToken: vi.fn(),
  createLoginToken: vi.fn(() => ['accessToken', 'refreshToken'])
}));

describe('RefreshService', () => {
  let service: RefreshService;
  let repoMock: Mocked<IRefreshRepository>;

  beforeEach(() => {
    repoMock = {
      refresh: vi.fn()
    }

    service = new RefreshService(repoMock);
    vi.resetAllMocks();
  });

  it('Should create both tokens for tenant', async () => {
    (verifyToken as any).mockReturnValue({
      tenantId: '123',
      tenantSlug: 'tenant-slug',
      role: 'tenant'
    });
    repoMock.refresh.mockResolvedValue({
       id: '123', 
       tenantSlug: 'tenant-slug', 
       role: 'tenant' 
    });
    expect(await service.refresh('token')).toEqual(['accessToken', 'refreshToken']);
    expect(repoMock.refresh).toHaveBeenCalledWith({ table: 'tenant', id: '123' })
  });

  it('Should create both tokens for admin', async () => {
    (verifyToken as any).mockReturnValue({ adminId: '123', role: 'admin' });
    repoMock.refresh.mockResolvedValue({ id: '123', role: 'admin' });
    expect(await service.refresh('token')).toEqual(['accessToken', 'refreshToken']);
    expect(repoMock.refresh).toHaveBeenCalledWith({ table: 'admins', id: '123' });
  });

  it('Should create both tokens for user', async () => {
    (verifyToken as any).mockReturnValue({ userId: '123', role: 'user' });
    repoMock.refresh.mockResolvedValue({ id: '123', role: 'user' });
    expect(await service.refresh('token')).toEqual(['accessToken', 'refreshToken']);
    expect(repoMock.refresh).toHaveBeenCalledWith({ table: 'users', id: '123' });
  });

  it('Should throw if user not found', async () => {
    (verifyToken as any).mockReturnValue({ userId: '123', role: 'user' });
    repoMock.refresh.mockResolvedValue(null);
    await expect(service.refresh('token')).rejects.toThrowError('Usuário não encontrado');
  });

  it('Should call identityBasedToken with correct identity for tenant', async () => {
    const spy = vi.spyOn(service, 'identityBasedToken');
    (verifyToken as any).mockReturnValue({ tenantId: '123', tenantSlug: 'tenant-slug', role: 'tenant' });
    repoMock.refresh.mockResolvedValue({ id: '123', tenantSlug: 'tenant-slug', role: 'tenant' });
    await service.refresh('token');
    expect(spy).toHaveBeenCalledWith({ id: '123', tenantSlug: 'tenant-slug', role: 'tenant' });
    spy.mockRestore();
  });

  it('Should call identityBasedToken with correct identity for admin', async () => {
    const spy = vi.spyOn(service, 'identityBasedToken');
    (verifyToken as any).mockReturnValue({ adminId: '123', role: 'admin' });
    repoMock.refresh.mockResolvedValue({ id: '123', role: 'admin' });
    await service.refresh('token');
    expect(spy).toHaveBeenCalledWith({ id: '123', role: 'admin' });
    spy.mockRestore();
  });

  it('Should call identityBasedToken with correct identity for user', async () => {
    const spy = vi.spyOn(service, 'identityBasedToken');
    (verifyToken as any).mockReturnValue({ userId: '123', role: 'user' });
    repoMock.refresh.mockResolvedValue({ id: '123', role: 'user' });
    await service.refresh('token');
    expect(spy).toHaveBeenCalledWith({ id: '123', role: 'user' });
    spy.mockRestore();
  });

  it('identityBasedToken should call createLoginToken for tenant', () => {
    const result = service.identityBasedToken({ id: '123', tenantSlug: 'tenant-slug', role: 'tenant' });
    expect(createLoginToken).toHaveBeenCalledWith('123', 'tenantId', 'tenant', 'tenant-slug');
    expect(result).toEqual(['accessToken', 'refreshToken']);
  });

  it('identityBasedToken should call createLoginToken for admin', () => {
    const result = service.identityBasedToken({ id: '123', role: 'admin' });
    expect(createLoginToken).toHaveBeenCalledWith('123', 'adminId', 'admin');
    expect(result).toEqual(['accessToken', 'refreshToken']);
  });

  it('identityBasedToken should call createLoginToken for user', () => {
    const result = service.identityBasedToken({ id: '123', role: 'user' });
    expect(createLoginToken).toHaveBeenCalledWith('123', 'userId', 'user');
    expect(result).toEqual(['accessToken', 'refreshToken']);
  });
})