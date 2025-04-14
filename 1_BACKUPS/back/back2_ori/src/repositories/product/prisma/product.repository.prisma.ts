import { Product } from "../../../entities/product";
import { PrismaClient } from "../../../generated/prisma";
import { ProductRepository } from "../product.repository";

export class ProductRepositoryPrisma implements ProductRepository {
  private constructor(readonly repository: PrismaClient) {}

  public static build(repository: PrismaClient) {
    return new ProductRepositoryPrisma(repository);
  }

  public async save(product: Product): Promise<void> {
    const data = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };

    await this.repository.product.create({ data });
  }

  public async list(): Promise<Product[]> {
    const aProduct = await this.repository.product.findMany();

    const products: Product[] = aProduct.map((p) => {
      const { id, name, price, quantity } = p;
      return Product.with(id, name, price, quantity);
    });

    return products;
  }

  public async update(product: Product): Promise<void> {
    const data = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };

    await this.repository.product.update({
      where: {
        id: product.id,
      },
      data,
    });
  }

  public async find(id: string): Promise<Product | null> {
    const aProduct = await this.repository.product.findUnique({
      where: { id },
    });
    if (!aProduct) {
      return null;
    }

    const { name, price, quantity } = aProduct;

    const product = Product.with(id, name, price, quantity);

    return product;
  }
}
