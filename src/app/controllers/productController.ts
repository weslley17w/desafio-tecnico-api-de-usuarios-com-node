import { Request, Response } from 'express';
import { ProductService } from '../services/productService.js';
import { productSchemaDTO } from '../validadators/productSchema.js';

interface IRequest extends Request {
  userId: string;
}

export class ProductController {
  private readonly productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  public async create(req: Request, res: Response): Promise<Response | void> {
    const { userId } = req as IRequest;
    const data = { ...req.body, created_by: userId };
    const product = await this.productService.create(data);
    return res.status(201).json(product);
  }

  public async delete(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    const userId = (req as IRequest).userId;
    await this.productService.delete({ id }, userId);
    return res.status(204).send();
  }

  public async findPaginatedFiltered(req: Request, res: Response): Promise<Response | void> {
    const userId = (req as IRequest).userId;
    const { page, limit, ...filters } = req.query;
    const result = await this.productService.findPaginatedFiltered({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      filters: filters as Partial<productSchemaDTO>,
      userId,
    });
    return res.status(200).json(result);
  }

  public async findById(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    const product = await this.productService.findById(id);
    return res.status(200).json(product);
  }

  public async update(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    const userId = (req as IRequest).userId;
    const data = req.body;
    const updatedProduct = await this.productService.update(id, data, userId);
    return res.status(200).json(updatedProduct);
  }
}
