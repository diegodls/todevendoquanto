import { Product } from "../../domain/product/entity/product";
import { ProductGateway } from "../../domain/product/gateway/product.gateway";
import { Usecase } from "../usecase";

export type CreateProductInputDto = {
  name: string;
  price: number;
  // não utilizei o "name: ProductProps["xyz"]" devido a classe/função poder receber algo diferente e tratar/converter, como um price em string e converter em number para a classe de "Product".
};
export type CreateProductOutputDto = {
  id: string;
};

export class CreateProductUsecase
  implements Usecase<CreateProductInputDto, CreateProductOutputDto>
{
  private constructor(private readonly productGateway: ProductGateway) {}

  public static create(productGateway: ProductGateway) {
    // responsável pela interação do usecase com a camada de persistência.
    return new CreateProductUsecase(productGateway);
  }

  public async execute({
    name,
    price,
  }: CreateProductInputDto): Promise<CreateProductOutputDto> {
    // isso aqui não sabe fazer nada, não cria, não salva, apenas
    // controla o fluxo "pedindo" para criar/salvar/etc...
    // pode ser que aqui seja necessário controlar as verificações
    // se existe, se é o dado correto e etc...
    // mas no geral é apenas fluxo

    const aProduct = Product.create(name, price);

    await this.productGateway.save(aProduct);

    const output: CreateProductOutputDto = this.presentOutput(aProduct);

    return output;
  }

  private presentOutput(product: Product): CreateProductOutputDto {
    const output: CreateProductOutputDto = {
      id: product.id,
    };

    return output;
  }
}
