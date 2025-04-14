export type ProductProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export class Product {
  private constructor(private readonly props: ProductProps) {
    // this.validate();
  }
  // isso faz com que não seja possível utilizar o:
  // product = new Product(blablabla)
  // para isso, usamos o método "create".

  // essa classe não tem setters pois é um entidade rica
  // com os modelos de negócios, e não para ser apenas
  // um armazenador de dados

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
    // usado majoritariamente para recuperar dados do db
    return new Product(props);
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

  public increaseQuantity(quantity: number) {
    this.props.quantity += quantity;
  }

  public decreaseQuantity(quantity: number) {
    this.props.quantity -= quantity;
  }

  // private validate() {
  //   if (this.props.quantity < 0) {
  //     throw new Error("Product quantity should be positive!");
  //   }
  // }
}
