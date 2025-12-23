import { CompareInterface } from "@/core/ports/infrastructure/protocols/encryption/compare-interface";
import { compare } from "bcrypt";

export class Compare implements CompareInterface {
  async execute(input: string, encrypted: string): Promise<boolean> {
    return await compare(input, encrypted);
  }
}
