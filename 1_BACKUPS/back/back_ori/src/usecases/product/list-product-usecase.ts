import { Product } from "../../domain/product/entity/product";
import { ProductGateway } from "../../domain/product/gateway/product.gateway";
import { Usecase } from "../usecase";

export type ListProductInputDto = void;

export type ListProductOutputDto = {
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
};

export class ListProductUsecase
  implements Usecase<ListProductInputDto, ListProductOutputDto>
{
  private constructor(private readonly ProductGateway: ProductGateway) {}

  public static create(productGateway: ProductGateway) {
    return new ListProductUsecase(productGateway);
  }

  public async execute(): Promise<ListProductOutputDto> {
    const aProduct = await this.ProductGateway.list();

    const output = this.presentOutput(aProduct);

    return output;
  }

  private presentOutput(products: Product[]): ListProductOutputDto {
    // mesmo que neste caso o retorno seja igual ao "Product"
    // Em outros caso pode não ser, podendo ser necessário editar o
    // retorno abaixo no .map(), e também, o "Product" é uma entidade
    // E entidades não podem ser acessadas diretamente pelo "Gateway"
    // Sendo necessário passar primeiro pelo "Usecase"
    //            Gateway         <>            Usecase                 <> Entity
    // this.ProductGateway.list() <> ListProductUsecase(presentOutput)  <> Product
    return {
      products: products.map((p) => {
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
        };
      }),
    };
  }
}
