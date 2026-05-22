import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";
import { OrdersService } from "../../../api/orders/ordersService";
import { ICreateOrder, IOrderRepository } from "../../../api/orders/ordersRepository";
import { Orders } from "../../../api/orders/entities/order-entitie";
import { Decimal } from "../../../generated/prisma/internal/prismaNamespace";
import { OrderSchema } from "../../../api/orders/types/order-types";
import { CustomError } from "../../../errors/errorHandler";
import { ErrorCode } from "../../../types/constants/error-codes-constants";

describe('OrderService', () => {
  let service: OrdersService;
  let repoMock: Mocked<IOrderRepository>;

  beforeEach(() => {
    repoMock = {
      getOrders: vi.fn(),
      getTenantPin: vi.fn(),
      getUserOrders: vi.fn(),
      patchOrders: vi.fn(),
      create: vi.fn(),
      getProductsPrice: vi.fn(),
      getAditionalsPrice: vi.fn(),
    }

    service = new OrdersService(repoMock);
    vi.resetAllMocks();
  });

  function mockPedidosItens (overrides: {}) {
    return {
      nomeProduto: 'Produto 1',
      descProduto: 'Descrição do produto 1',
      quantidade: 2,
      itensAdicionais: [
        {
          nomeProduto: 'Adicional 1',
          descProduto: 'Descrição do adicional 1',
          ...overrides
        }
      ]
    }
  }

  function mockOrder (overrides: Partial<Orders> = {}): Orders {
    return {
      id: 'order1',
      nomeCompleto: 'Cliente 1',
      totalOrderPrice: 1,
      tipoEntrega: 'delivery',
      observacao: 'Sem cebola',
      createdAt: new Date('2024-06-01T12:00:00Z'),
      status: 'concluido',
      pedidosItens: [mockPedidosItens({})],
      ...overrides
    }
  }

  function mockICreateOrder (overrides: Partial<ICreateOrder> = {}): ICreateOrder {
    return {
      id: 'order1',
      tenantSlug: 'tenant-slug',
      nomeCompleto: 'Cliente 1',
      endereco: 'Rua 1',
      bairro: 'Centro',
      cep: '12345678',
      numero: '123',
      complemento: 'comp',
      whatsapp: '11999999999',
      formaPagamento: 'cartão',
      tipoEntrega: 'delivery',
      taxaEntrega: 20.00 as unknown as Decimal,
      totalOrderPrice: 100.00 as unknown as Decimal,
      observacao: 'Sem cebola',
      status: 'concluido',
      createdAt: new Date('2024-06-01T12:00:00Z'),
      updatedAt: new Date('2024-06-01T12:00:00Z'),
      ...overrides
    }
  }

  function mockOrderSchema (): OrderSchema {
    return {
      nomeCompleto: 'Cliente 1',
      tipoEntrega: "delivery",
      totalOrderPrice: 15.00,
      tenantSlug: 'tenant-slug',
      endereco: 'endereco',
      bairro: 'centro',
      cep: '12345678',
      numero: 'string',
      whatsapp: '11999999999',
      formaPagamento: "cartao",
      taxaEntrega: 5.00,
      items: [{
        id: 'item1',
        nomeProduto: 'Produto 1',
        descProduto: 'Descrição do produto 1',
        categoria: 'categoria',
        quantidade: 1,
        precoProduto: 10.00,
        totalPrice: 10.00,
        imageUrl: '',
        adicionais: []
      }],
      observacao: 'Sem cebola',
    }
  }

  it('Should return tenant orders', async () => {
    repoMock.getOrders.mockResolvedValue([mockOrder()]);
    expect(await service.getOrders('tenant-slug')).toEqual([mockOrder()]);
  });

  it('Should return an empty array if tenant has no orders', async () => {
    repoMock.getOrders.mockResolvedValue([]);
    expect(await service.getOrders('tenant-slug')).toEqual([]);
  });

  it('Should patch orders', async () => {
    repoMock.patchOrders.mockResolvedValue(mockICreateOrder({ status: 'cancelado' }));
    expect(await service.patchOrders('string', 'concluido', 'tenant-slug')).toEqual(mockICreateOrder({ status: 'cancelado' }));
  });

  it('Should create order', async () => {
    repoMock.getTenantPin.mockResolvedValue({ pin: '123123' });
    repoMock.getProductsPrice.mockResolvedValue([{ precoProduto: 10.00 } as unknown as { precoProduto: Decimal }]);
    repoMock.getAditionalsPrice.mockResolvedValue([]);
    repoMock.create.mockResolvedValue(mockICreateOrder());
    
    expect(await service.create(mockOrderSchema(), 'userId')).toEqual(mockICreateOrder());
  
    expect(repoMock.create).toHaveBeenCalledWith(
      mockOrderSchema(), 'userId', '123123', expect.stringMatching(/^[0-9a-z]{6}$/)
    )
  });

  it('Should throw error because no tenant-pin', async () => {
    repoMock.getTenantPin.mockResolvedValue(null);
    await expect(service.create(mockOrderSchema(), 'userId')).rejects.toThrow(new CustomError('Pin não configurado', 404, ErrorCode.PIN_NOT_FOUND));
  });

  it('Should throw error because tenant.pin = null', async () => {
    repoMock.getTenantPin.mockResolvedValue({ pin: null });
    await expect(service.create(mockOrderSchema(), 'userId')).rejects.toThrow(new CustomError('Pin não configurado', 404, ErrorCode.PIN_NOT_FOUND));
  });

  it('Should throw error because product and aditional prices are empty []', async () => {
    repoMock.getTenantPin.mockResolvedValue({ pin: '123123' });
    repoMock.getProductsPrice.mockResolvedValue([]);
    repoMock.getAditionalsPrice.mockResolvedValue([]);

    await expect(service.create(mockOrderSchema(), 'userId')).rejects.toThrow(new CustomError('Nenhum produto cadastrado', 404, ErrorCode.PRODUCT_NOT_FOUND));
  });

  it('Prices should not match', async () => {
    repoMock.getTenantPin.mockResolvedValue({ pin: '123123' });
    repoMock.getProductsPrice.mockResolvedValue([{ precoProduto: 15.00 } as unknown as { precoProduto: Decimal }]);
    repoMock.getAditionalsPrice.mockResolvedValue([]);
    repoMock.create.mockResolvedValue(mockICreateOrder());
    
    await expect(service.create(mockOrderSchema(), 'userId')).rejects.toThrow(new CustomError('Preços não batem', 400, ErrorCode.BAD_REQUEST));
  });

  it('Aditional prices should not match', async () => {
  const mockBody = mockOrderSchema();
  mockBody.totalOrderPrice = 15.00; // 10 produto + 5 adicional + 5 taxa

  repoMock.getTenantPin.mockResolvedValue({ pin: '123123' });
  repoMock.getProductsPrice.mockResolvedValue([
    { precoProduto: 10.00 } as unknown as { precoProduto: Decimal }
  ]);
  repoMock.getAditionalsPrice.mockResolvedValue([
    { precoProduto: 5.00 } as unknown as { precoProduto: Decimal }
  ]);
  repoMock.create.mockResolvedValue(mockICreateOrder());

  await expect(service.create(mockBody, 'userId')).rejects.toThrow(
    new CustomError('Preços não batem', 400, ErrorCode.BAD_REQUEST)
  );
});

  it('Should create order with adicionais', async () => {
    const bodyComAdicional = mockOrderSchema();
    bodyComAdicional.totalOrderPrice = 20.00; // 10 produto + 5 adicional + 5 taxa
    bodyComAdicional.items[0].adicionais = [{
      id: 'adicional-1',
      categoria: 'categoria',
      descProduto: 'desc',
      nomeProduto: 'produo 1',
      precoProduto: 5.00
    }];

    repoMock.getTenantPin.mockResolvedValue({ pin: '123123' });
    repoMock.getProductsPrice.mockResolvedValue([
      { precoProduto: 10.00 } as unknown as { precoProduto: Decimal }
    ]);
    repoMock.getAditionalsPrice.mockResolvedValue([
      { precoProduto: 5.00 } as unknown as { precoProduto: Decimal }
    ]);
    repoMock.create.mockResolvedValue(mockICreateOrder());

    expect(await service.create(bodyComAdicional, 'userId')).toEqual(mockICreateOrder());
  });
})