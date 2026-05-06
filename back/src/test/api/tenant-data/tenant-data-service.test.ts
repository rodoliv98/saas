import { describe, it, beforeEach, expect, vi } from 'vitest';
import { TenantDataService } from '../../../api/tenant-data/tenant-data-service';
import { CustomError } from '../../../middlewares/errorHandler';
import { ErrorCode } from '../../../types/constants/error-codes-constants';

vi.mock('../../../integrations/cloudinary/cloudinary-upload', () => ({
  uploadToCloudinary: vi.fn(async (url, publicId) => ({ url: 'cloud-url', public_id: 'cloud-id' }))
}));
import { uploadToCloudinary } from '../../../integrations/cloudinary/cloudinary-upload';

describe('TenantDataService', () => {
  let repoMock: any;
  let service: TenantDataService;

  beforeEach(() => {
    repoMock = {
      getData: vi.fn(),
      getOrdersData: vi.fn(),
      patchData: vi.fn(),
      addLogo: vi.fn(),
      addBanner: vi.fn(),
      getImagePublicId: vi.fn()
    };
    service = new TenantDataService(repoMock);
    (uploadToCloudinary as any).mockClear();
  });

  it('should throw if tenant not found on getData', async () => {
    repoMock.getData.mockResolvedValue(null);
    await expect(service.getData('1')).rejects.toThrow(new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND));
  });

  it('should return tenant data on getData', async () => {
    repoMock.getData.mockResolvedValue({ id: '1', nome: 'Tenant' });
    const result = await service.getData('1');
    expect(result).toEqual({ id: '1', nome: 'Tenant' });
  });

  it('should return orders on getOrders', async () => {
    repoMock.getOrdersData.mockResolvedValue([{ id: 'order1' }]);
    const result = await service.getOrders('slug', { year: 2024, month: 5, status: 'concluido' });
    expect(result).toEqual([{ id: 'order1' }]);
  });

  it('should throw if tenant not found on patchData', async () => {
    repoMock.patchData.mockResolvedValue(null);
    await expect(service.patchData('1', {
      bairro: 'Centro',
      municipio: 'Cidade',
      complemento: null,
      endereco: 'Rua 1',
      numero: '123',
      estado: 'SP',
      diasFuncionamento: [],
      horarioFuncionamento: '08:00-18:00',
      tempoPreparo: '30',
      whatsapp: '11999999999',
      pin: '123'
    }))
      .rejects.toThrow(new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND));
  });

  it('should patch data and return updated tenant', async () => {
    repoMock.patchData.mockResolvedValue({ id: '1', nome: 'Tenant' });
    const result = await service.patchData('1', {
      bairro: 'Centro',
      municipio: 'Cidade',
      complemento: null,
      endereco: 'Rua 1',
      numero: '123',
      estado: 'SP',
      diasFuncionamento: [],
      horarioFuncionamento: '08:00-18:00',
      tempoPreparo: '30',
      whatsapp: '11999999999',
      pin: '123'
    });
    expect(result).toEqual({ id: '1', nome: 'Tenant' });
  });

  it('should throw if tenant not found on addLogo', async () => {
    repoMock.getImagePublicId.mockResolvedValue(null);
    await expect(service.addLogo('1', 'logo-url')).rejects.toThrow(new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND));
  });

  it('should upload logo and call repo.addLogo', async () => {
    repoMock.getImagePublicId.mockResolvedValue({ logoPublicId: 'logo-public-id' });
    await service.addLogo('1', 'logo-url');
    expect(uploadToCloudinary).toHaveBeenCalledWith('logo-url', 'logo-public-id');
    expect(repoMock.addLogo).toHaveBeenCalledWith('1', { url: 'cloud-url', public_id: 'cloud-id' });
  });

  it('should throw if tenant not found on addBanner', async () => {
    repoMock.getImagePublicId.mockResolvedValue(null);
    await expect(service.addBanner('1', 'banner-url')).rejects.toThrow(new CustomError('Estabelecimento não encontrado', 404, ErrorCode.TENANT_NOT_FOUND));
  });

  it('should upload banner and call repo.addBanner', async () => {
    repoMock.getImagePublicId.mockResolvedValue({ bannerPublicId: 'banner-public-id' });
    await service.addBanner('1', 'banner-url');
    expect(uploadToCloudinary).toHaveBeenCalledWith('banner-url', 'banner-public-id');
    expect(repoMock.addBanner).toHaveBeenCalledWith('1', { url: 'cloud-url', public_id: 'cloud-id' });
  });
});
