import { Product } from "../../entities/product";

export interface ProductRepository {
  save(product: Product): Promise<void>;
  list(): Promise<Product[]>;
  update(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
}
