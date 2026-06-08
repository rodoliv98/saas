import { describe, it, beforeEach, vi, expect, Mocked } from "vitest";
import { TelegramService } from "../../../api/telegram/telegram-service";
import { ITelegramRepo } from "../../../api/telegram/telegram-repo";
import { OrdersDelivery } from "../../../api/telegram/intities/order-entities";
import { DeliveryMan } from "../../../api/telegram/intities/delivery-entities";
import { Decimal } from "@prisma/client/runtime/library";

describe('TelegramService', () => {
  let service: TelegramService;
  let repoMock: Mocked<ITelegramRepo>;

  beforeEach(() => {
    repoMock = {
      getOrders: vi.fn(),
      registerDeliveryMan: vi.fn(),
      updateDeliveryOrder: vi.fn(),
      findActivationCode: vi.fn(),
      findDeliveryMan: vi.fn()
    }

    service = new TelegramService(repoMock);
  });

  function mockDeliveryMan(): DeliveryMan {
    return {
      entregadores: [{ id: '123fdrew2131' }]
    }
  };

  function mockOrderDelivery(): OrdersDelivery {
    return {
      short_id: "ABC123",
      nomeCompleto: "João Silva",
      endereco: "Rua das Flores",
      bairro: "Centro",
      numero: "123",
      complemento: "Apartamento 202",
      formaPagamento: "PIX",
      totalOrderPrice: new Decimal("49.90"),
      pedidosItens: [
        {
          nomeProduto: "X-Burguer",
          quantidade: 2,
          itensAdicionais: [
            { nomeProduto: "Bacon" },
            { nomeProduto: "Queijo Extra" }
          ]
        },
        {
          nomeProduto: "Refrigerante 2L",
          quantidade: 1,
          itensAdicionais: []
        }
      ]
    };
  }

  it('getOrders shoudl return a string', async () => {
    const fakeDeliveryMan = mockDeliveryMan();
    const fakeOrderDelivery = mockOrderDelivery();

    repoMock.findDeliveryMan.mockResolvedValueOnce(fakeDeliveryMan);
    repoMock.getOrders.mockResolvedValueOnce([fakeOrderDelivery]);
    vi.spyOn(service as any, 'formatData').mockReturnValueOnce('formated-string');
    
    const result = await service.getOrders('pin-123', 9007199254740996n);
    
    expect(result).toEqual('formated-string');
  })
})