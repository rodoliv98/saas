import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginService } from '../../../api/login/loginService';
import type { ILoginRepository } from '../../../api/login/loginRepository';
import { CustomError } from '../../../errors/errorHandler';
import { ErrorCode } from '../../../types/constants/error-codes-constants';

vi.mock('bcrypt', () => ({
  default: { compare: vi.fn() }
}));
import bcrypt from 'bcrypt';

vi.mock('../../../utils/tokenJWT', () => ({
  createLoginToken: vi.fn(() => ['access', 'refresh'])
}));
import { createLoginToken } from '../../../utils/tokenJWT';

describe('LoginService', () => {
  let service: LoginService;
  let repoMock: ILoginRepository;

  beforeEach(() => {
    repoMock = {
      login: vi.fn()
    };
    service = new LoginService(repoMock);
    (createLoginToken as any).mockClear();
    (bcrypt.compare as any).mockClear();
  });

  it('should throw if user not found', async () => {
    (repoMock.login as any).mockResolvedValue(null);
    await expect(service.login({ email: 'a@a.com', senha: '123' }))
      .rejects.toThrow(new CustomError('Nenhum usuário encontrado com esse email.', 404, ErrorCode.NOT_FOUND));
  });

  it('should throw if tenant is inactive', async () => {
    (repoMock.login as any).mockResolvedValue({ id: '1', senha: 'hash', tenantSlug: 'slug', active: false, kind: 'tenant' });
    await expect(service.login({ email: 'a@a.com', senha: '123' }))
      .rejects.toThrow(new CustomError('Sua conta ainda não foi ativada, tente mais tarde.', 403, ErrorCode.TENANT_INACTIVE));
  });

  it('should throw if password is invalid', async () => {
    (repoMock.login as any).mockResolvedValue({ id: '1', senha: 'hash', tenantSlug: 'slug', active: true, kind: 'tenant' });
    (bcrypt.compare as any).mockResolvedValue(false);
    await expect(service.login({ email: 'a@a.com', senha: '123' }))
      .rejects.toThrow(new CustomError('Email ou senha inválida.', 400, ErrorCode.BAD_REQUEST));
  });

  it('should return tokens for valid tenant', async () => {
    (repoMock.login as any).mockResolvedValue({ id: '1', senha: 'hash', tenantSlug: 'slug', active: true, kind: 'tenant' });
    (bcrypt.compare as any).mockResolvedValue(true);
    const result = await service.login({ email: 'a@a.com', senha: '123' });
    expect(result).toEqual(['access', 'refresh']);
    expect(createLoginToken).toHaveBeenCalledWith('1', 'tenantId', 'tenant', 'slug');
  });

  it('should return tokens for valid user', async () => {
    (repoMock.login as any).mockResolvedValue({ id: '2', senha: 'hash', kind: 'user' });
    (bcrypt.compare as any).mockResolvedValue(true);
    const result = await service.login({ email: 'b@b.com', senha: '123' });
    expect(result).toEqual(['access', 'refresh']);
    expect(createLoginToken).toHaveBeenCalledWith('2', 'userId', 'user');
  });
});