import { Product } from "../../../entities/product";
import { ProductRepository } from "../../../repositories/product/product.repository";
import { AlreadyExistError, NotFoundError } from "../../../util/api.errors";
import {
  BuyOutputDto,
  CreateOutputDto,
  ListOutputDto,
  ProductService,
  SellOutputDto,
} from "../product.service";

export class ProductServiceImplementation implements ProductService {
  private constructor(readonly repository: ProductRepository) {}

  public static build(repository: ProductRepository) {
    return new ProductServiceImplementation(repository);
  }

  public async sell(id: string, amount: number): Promise<SellOutputDto> {
    const aProduct = await this.repository.findById(id);

    if (!aProduct) {
      throw new NotFoundError(`Não foi encontrado o produto com ID: ${id}`);
    }

    aProduct.sell(amount);

    await this.repository.update(aProduct);

    const output: SellOutputDto = {
      id: aProduct.id,
      balance: aProduct.quantity,
    };

    return output;
  }

  public async create(name: string, price: number): Promise<CreateOutputDto> {
    const productExists = await this.repository.findByName(name);

    if (productExists) {
      throw new AlreadyExistError(`${name} já existe!`);
    }

    const aProduct = Product.create(name, price);

    await this.repository.save(aProduct);

    const output: CreateOutputDto = {
      id: aProduct.id,
      balance: aProduct.quantity,
    };

    return output;
  }

  public async buy(id: string, amount: number): Promise<BuyOutputDto> {
    const aProduct = await this.repository.findById(id);

    if (!aProduct) {
      throw new NotFoundError(`O produto ${id} não foi encontrado!`);
    }

    aProduct.buy(amount);

    await this.repository.update(aProduct);

    const output: BuyOutputDto = {
      id: aProduct.id,
      balance: aProduct.quantity,
    };

    return output;
  }

  public async list(): Promise<ListOutputDto> {
    const aProducts = await this.repository.list();

    const products = aProducts.map((p) => {
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        balance: p.quantity,
      };
    });

    const output: ListOutputDto = {
      products,
    };
    return output;
  }
}
