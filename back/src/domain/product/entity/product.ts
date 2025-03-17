export type ProductProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export class Product {
  private constructor(private props: ProductProps) {
    this.validate();
  }
  // isso faz com que não seja possível utilizar o:
  // product = new Product(blablabla)
  // para isso, usamos o método "create".

  public static create(
    name: ProductProps["name"],
    price: ProductProps["price"]
  ) {
    return new Product({
      id: crypto.randomUUID().toString(),
      name,
      price,
      quantity: 0,
    });
  }

  public static with(props: ProductProps) {
    return new Product(props);
  }

  private validate() {
    if (this.props.quantity < 0) {
      throw new Error("Product quantity should ");
    }
  }
}
