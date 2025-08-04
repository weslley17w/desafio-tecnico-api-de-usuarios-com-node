import { Product } from '../../database/models/index.js';
import { productSchemaDTO } from '../validadators/productSchema.js';

export class ProductRepository {
  public async create(data: productSchemaDTO): Promise<Product> {
    return Product.create(data);
  }

  public async delete(id: string): Promise<void> {
    await Product.destroy({
      where: { id },
    });
  }

  public async findPaginatedFiltered(
    page: number,
    limit: number,
    filters: Partial<productSchemaDTO>,
    created_by: string,
  ): Promise<{ products: Product[]; total: number }> {
    const { count, rows } = await Product.findAndCountAll({
      where: {
        ...filters,
        created_by,
      },
      limit,
      offset: (page - 1) * limit,
    });
    return { products: rows, total: count };
  }

  public async findById(id: string): Promise<Product | null> {
    return Product.findByPk(id);
  }

  public async Update(id: string, data: Partial<productSchemaDTO>): Promise<Product | null> {
    const product = await Product.findByPk(id);
    if (product) return product.update(data);
    else return null;
  }
}
