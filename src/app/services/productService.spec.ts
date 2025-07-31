import { CacheService } from '../../shared/sevices/cacheService.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { productSchema, productSchemaDTO, productUpdateSchema } from '../validadators/productSchema.js';
import { ProductService } from './productService.js';
import { HttpException } from '../../shared/erros/HttpExeption.js';
import { ZodError } from 'zod';

let productMock: productSchemaDTO;
let productRepository: Partial<ProductRepository>;
let cacheServiceMock: Partial<CacheService>;
let service: ProductService;

beforeEach(() => {
  productMock = {
    title: 'dsd',
    price: 11,
    description: 'dsdsdd',
    created_by: '9383a4f2-937e-4409-9df0-2c5f037c9857',
  } as productSchemaDTO;

  productRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    findPaginatedFiltered: jest.fn(),
    findById: jest.fn(),
    Update: jest.fn(),
  };

  cacheServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  service = new ProductService(productRepository as any, cacheServiceMock as any);
});

describe('ProductService', () => {
  describe('create', () => {
    it('should create a product successfully', async () => {
      (productRepository.create as jest.Mock).mockResolvedValue(productMock);
      const result = await service.create(productMock);
      expect(productRepository.create).toHaveBeenCalledWith(productMock);
      expect(result).toEqual(productMock);
    });

    it('should throw HttpException for invalid data', async () => {
      const invalidData = { ...productMock, price: 'invalid' };
      await expect(service.create(invalidData as any)).rejects.toThrow(HttpException);
    });

    it('should throw for generic error', async () => {
      (productRepository.create as jest.Mock).mockRejectedValue(new Error('Generic error'));

      await expect(service.create(productMock)).rejects.toThrow('Generic error');
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      const id = 'e8476373-5981-486f-8d2e-fbd4526f266b';
      const userId = productMock.created_by;
      productRepository.findById = jest.fn().mockResolvedValue(productMock);
      (productRepository.delete as jest.Mock).mockResolvedValue(undefined);
      await service.delete({ id }, userId);
      expect(productRepository.delete).toHaveBeenCalledWith(id);
      expect(cacheServiceMock.del).toHaveBeenCalledWith(`product:${id}`);
    });

    it('should delete a product a', async () => {
      const id = 'e8476373-5981-486f-8d2e-fbd4526f266b';
      const userId = productMock.created_by;
      productRepository.findById = jest.fn().mockResolvedValue(productMock);
      (productRepository.delete as jest.Mock).mockResolvedValue(undefined);
      await service.delete({ id }, userId);
      expect(productRepository.delete).toHaveBeenCalledWith(id);
      expect(cacheServiceMock.del).toHaveBeenCalledWith(`product:${id}`);
    });

    it('should throw 404 if product not found', async () => {
      const id = 'e8476373-5981-486f-8d2e-fbd4526f266b';
      const userId = productMock.created_by;
      productRepository.findById = jest.fn().mockResolvedValue(null);
      (productRepository.delete as jest.Mock).mockResolvedValue(undefined);
      await expect(service.delete({ id }, userId)).rejects.toThrow('Produto não encontrado.');
    });

    it('should throw 403 if user is not owner', async () => {
      const id = 'e8476373-5981-486f-8d2e-fbd4526f266b';
      const userId = 'diferet-id';
      productRepository.findById = jest.fn().mockResolvedValue(productMock);
      (productRepository.delete as jest.Mock).mockResolvedValue(undefined);
      await expect(service.delete({ id }, userId)).rejects.toThrow('Você não tem permissão para excluir este produto.');
    });

    it('should delete with invalid id', async () => {
      productSchema.parse = jest.fn().mockImplementation(() => {
        throw new ZodError([
          {
            path: ['id'],
            message: 'Invalid ID format',
            code: 'custom',
            input: 'invalid-id',
          },
        ]);
      });

      await expect(service.delete({ id: 'invalid-id' }, productMock.created_by)).rejects.toThrow(
        'Erro de validação de dados.',
      );
    });
  });

  describe('findPaginatedFiltered', () => {
    it('should return cached data if available', async () => {
      const cacheData = { products: [productMock], total: 1 };
      (cacheServiceMock.get as jest.Mock).mockResolvedValue(cacheData);
      const result = await service.findPaginatedFiltered({
        page: 1,
        limit: 10,
        filters: {},
        userId: productMock.created_by,
      });
      expect(result).toEqual(cacheData);
    });

    it('should fetch from repository and cache if not cached', async () => {
      (cacheServiceMock.get as jest.Mock).mockResolvedValue(null);
      const repoData = { products: [productMock], total: 1 };
      (productRepository.findPaginatedFiltered as jest.Mock).mockResolvedValue(repoData);
      await service.findPaginatedFiltered({
        page: 1,
        limit: 10,
        filters: {},
        userId: productMock.created_by,
      });
      expect(productRepository.findPaginatedFiltered).toHaveBeenCalled();
      expect(cacheServiceMock.set).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return cached product if available', async () => {
      (cacheServiceMock.get as jest.Mock).mockResolvedValue(productMock);
      const result = await service.findById('test-id');
      expect(result).toEqual(productMock);
    });

    it('should fetch from repository and cache if not cached', async () => {
      (cacheServiceMock.get as jest.Mock).mockResolvedValue(null);
      productRepository.findById = jest.fn().mockResolvedValue(productMock);
      const result = await service.findById('test-id');
      expect(result).toEqual(productMock);
      expect(cacheServiceMock.set).toHaveBeenCalled();
    });

    it('should throw 404 if product not found', async () => {
      (cacheServiceMock.get as jest.Mock).mockResolvedValue(null);
      productRepository.findById = jest.fn().mockResolvedValue(null);
      await expect(service.findById('not-found')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update product if user is owner', async () => {
      const id = 'test-id';
      const userId = productMock.created_by;
      const updatedProduct = { ...productMock, title: 'updated' };
      productRepository.findById = jest.fn().mockResolvedValue(productMock);
      (productRepository.Update as jest.Mock).mockResolvedValue(updatedProduct);
      const result = await service.update(id, { title: 'updated' }, userId);
      expect(productRepository.Update).toHaveBeenCalledWith(id, { title: 'updated' });
      expect(cacheServiceMock.del).toHaveBeenCalledWith(`product:${id}`);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw 404 if product not found', async () => {
      productRepository.findById = jest.fn().mockResolvedValue(null);
      await expect(service.update('not-found', {}, productMock.created_by)).rejects.toThrow(HttpException);
    });

    it('should throw 403 if user is not owner', async () => {
      productRepository.findById = jest.fn().mockResolvedValue({ ...productMock, created_by: 'other-user' });
      await expect(service.update('test-id', {}, productMock.created_by)).rejects.toThrow(HttpException);
    });

    it('should throw 404 if update returns null', async () => {
      productRepository.findById = jest.fn().mockResolvedValue(productMock);
      (productRepository.Update as jest.Mock).mockResolvedValue(null);
      await expect(service.update('test-id', {}, productMock.created_by)).rejects.toThrow(HttpException);
    });

    it('should update product with invalid data', async () => {
      productUpdateSchema.parse = jest.fn().mockImplementation(() => {
        throw new ZodError([
          {
            path: ['id'],
            message: 'Invalid ID format',
            code: 'custom',
            input: 'invalid-id',
          },
        ]);
      });

      await expect(service.update('id-valid', { title: 'name' }, 'user-id')).rejects.toThrow(
        'Erro de validação de dados.',
      );
    });
  });
});
