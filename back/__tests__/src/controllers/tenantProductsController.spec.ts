import { Request, Response, NextFunction } from "express";
import { TenantProductsController } from "../../../src/controllers/tenantProductsController";
import { ITenantProductsService } from "../../../src/services/interfaces/tenantProductsInter";
import { IFormatProductsData } from "../../../src/utils/formatProductsData";

describe('TenantProductController', () => {
  let controller: TenantProductsController;
  let service: jest.Mocked<ITenantProductsService>;
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: NextFunction;

	beforeEach(() => {
		jest.resetAllMocks();

		service = {
			create: jest.fn(),
			delete: jest.fn(),
			getProductById: jest.fn(),
			getProducts: jest.fn(),
			patch: jest.fn()
		};

		req = { user: undefined, params: { id: '123' } };
		
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		}

		next = jest.fn();
		
		controller = new TenantProductsController(service);
	});
	
	function createMockFormatProducts (): IFormatProductsData {
		return {
			id: '123',
			nomeProduto: '123',
			descProduto: '123',
			categoria: '123',
			precoProduto: '123',
			imageUrl: '123',
			tamanho: '123',
			tempoPreparo: '123'
		}
	}

	test('getProducts method: 200', async () => {
		const id = '123';
		const product = createMockFormatProducts();
		req.user = id;

		service.getProducts.mockResolvedValueOnce([product]);
		await controller.getProducts(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([product]);
		//expect(result).toEqual(product);
		expect(service.getProducts).toHaveBeenCalledWith(id);
	});

	test('getProducts method: tenantId not found', async () => {
		await controller.getProducts(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: 'TenantID não encontrado' });
		expect(next).not.toHaveBeenCalledWith();
		expect(service.getProducts).not.toHaveBeenCalledWith();
	});

	test('getProducts method: next called', async () => {
		const id = '123';
		req.user = id;

		service.getProducts.mockRejectedValueOnce(new Error('error'));
		await controller.getProducts(req as Request, res as Response, next);

		expect(service.getProducts).toHaveBeenCalledWith(id);
		expect(next).toHaveBeenCalledWith(new Error('error'));
		expect(res.status).not.toHaveBeenCalledWith()
		expect(res.json).not.toHaveBeenCalledWith()
	});

	test('getProductById method: 200', async () => {
		const productId = req!.params!.id;
		const tenantId = '123';
		const product = createMockFormatProducts();
		req.user = tenantId;

		service.getProductById.mockResolvedValueOnce(product);
		await controller.getProductById(req as Request, res as Response, next);

		expect(service.getProductById).toHaveBeenCalledWith(productId, req.user);
		expect(next).not.toHaveBeenCalledWith();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(product);
	});

	/*test('getProductById method: id not found', async () => {
		req.params = undefined;
		
		await controller.getProductById(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: 'Id do produto não encontrado' });
		//expect()
	})*/
})