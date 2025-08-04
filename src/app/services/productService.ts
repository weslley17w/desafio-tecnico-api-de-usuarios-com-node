import { ZodError } from 'zod';
import { Product } from '../../database/models/index.js';
import { ProductRepository } from '../repositories/productRepository.js';
import {
  productSchema,
  productSchemaDTO,
  productDeleteSchema,
  productDeleteSchemaDTO,
  productUpdateSchema,
} from '../validadators/productSchema.js';
import { HttpException } from '../../shared/erros/HttpExeption.js';
import { CacheService } from '../../shared/sevices/cacheService.js';

const productKeyPrefix = {
  product: (id: string) => `product:${id}`,
  productUsers: (page: number, limit: number) => `product:page:${page}:limit:${limit}`,
};

export class ProductService {
  private readonly productRepository: ProductRepository;
  private readonly cacheService: CacheService;

  constructor(productRepository: ProductRepository, cacheService: CacheService) {
    this.productRepository = productRepository;
    this.cacheService = cacheService;
  }

  public async create(data: productSchemaDTO): Promise<Product> {
    try {
      productSchema.parse(data);
      const product = await this.productRepository.create(data);
      return product;
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new HttpException(400, 'Erro de validação de dados.', zodError);
      }
      throw error;
    }
  }

  public async delete({ id }: productDeleteSchemaDTO, userId: string): Promise<void> {
    try {
      productDeleteSchema.parse({ id });
      const cacheId = productKeyPrefix.product(id);
      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new HttpException(404, 'Produto não encontrado.');
      }

      if (product.created_by !== userId) {
        throw new HttpException(403, 'Você não tem permissão para excluir este produto.');
      }

      await this.productRepository.delete(id);
      await this.cacheService.del(cacheId);
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        throw new HttpException(400, 'Erro de validação de dados.', zodError);
      }
      throw error;
    }
  }

  public async findPaginatedFiltered({
    page,
    limit,
    filters,
    userId,
  }: {
    page: number;
    limit: number;
    filters: Partial<productSchemaDTO>;
    userId: string;
  }): Promise<{ products: Product[]; total: number }> {
    const cacheKey = productKeyPrefix.productUsers(page, limit);
    const cacheData = await this.cacheService.get<{ products: Product[]; total: number }>(cacheKey);
    if (cacheData) return cacheData;
    const result = await this.productRepository.findPaginatedFiltered(page, limit, filters, userId);
    await this.cacheService.set(cacheKey, result, 120);
    return result;
  }

  public async findById(id: string): Promise<Product | null> {
    const cacheId = productKeyPrefix.product(id);
    const cacheProduct = await this.cacheService.get<Product>(cacheId);

    if (cacheProduct) {
      return cacheProduct;
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new HttpException(404, 'Produto não encontrado.');
    }

    await this.cacheService.set(cacheId, product, 86400);
    return product;
  }

  public async update(id: string, data: Partial<productSchemaDTO>, userId: string): Promise<Product | null> {
    try {
      productUpdateSchema.parse(data);
      const product = await this.productRepository.findById(id);
      const cacheId = productKeyPrefix.product(id);

      if (!product) {
        throw new HttpException(404, 'Produto não encontrado.');
      }

      if (product.created_by !== userId) {
        throw new HttpException(403, 'Você não tem permissão para atualizar este produto.');
      }

      const updatedProduct = await this.productRepository.Update(id, data);

      await this.cacheService.del(cacheId);
      return updatedProduct;
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new HttpException(400, 'Erro de validação de dados.', zodError);
      }
      throw error;
    }
  }
}
