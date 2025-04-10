export type ProductProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export class Product {
  private constructor(readonly props: ProductProps) {}

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

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get price() {
    return this.props.price;
  }

  public get quantity() {
    return this.props.quantity;
  }

  public buy(amount: number) {
    this.props.quantity += amount;
  }

  public sell(amount: number) {
    if (this.props.quantity < amount) {
      throw new Error(`Quantidade do produto ${this.props.name} insuficiente!`);
    }

    this.props.quantity -= amount;
  }
}
