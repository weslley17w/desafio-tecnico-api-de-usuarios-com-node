import { ZodError } from 'zod';
import { Product } from '../../database/models/index.js';
import { ProductRepository } from '../repositories/productRepository.js';
import {
  productSchema,
  productSchemaDTO,
  productDeleteSchema,
  productDeleteSchemaDTO,
} from '../validadators/productSchema.js';
import { HttpException } from '../../shared/erros/HttpExeption.js';

export class ProductService {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
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
      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new HttpException(404, 'Produto não encontrado.');
      }

      if (product.created_by !== userId) {
        throw new HttpException(403, 'Você não tem permissão para excluir este produto.');
      }

      await this.productRepository.delete(id);
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
  }: {
    page: number;
    limit: number;
    filters: Partial<productSchemaDTO>;
  }): Promise<{ products: Product[]; total: number }> {
    const result = await this.productRepository.findPaginatedFiltered(page, limit, filters);
    return result;
  }

  public async findById(id: string): Promise<Product | null> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new HttpException(404, 'Produto não encontrado.');
    }
    return product;
  }

  public async update(id: string, data: Partial<productSchemaDTO>, userId: string): Promise<Product | null> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new HttpException(404, 'Produto não encontrado.');
      }
      if (product.created_by !== userId) {
        throw new HttpException(403, 'Você não tem permissão para atualizar este produto.');
      }
      const updatedProduct = await this.productRepository.Update(id, data);
      if (!updatedProduct) {
        throw new HttpException(404, 'Produto não encontrado para atualização.');
      }
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
