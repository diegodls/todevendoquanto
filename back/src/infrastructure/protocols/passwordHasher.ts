import { PasswordHasherInterface } from "@/core/ports/infrastructure/protocols/passwordHasher-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { encryptErrorsCodes } from "@/infrastructure/errors/codes/encryption/encrypt-errors";
import bcrypt from "bcrypt";

export class PasswordHasher implements PasswordHasherInterface {
  public async hash(input: string): Promise<string> {
    const saltRounds = 12;

    const hashed = await bcrypt.hash(input, saltRounds);

    if (!hashed) {
      throw new InternalError(
        "Internal Server Error!",
        {},
        encryptErrorsCodes.E_0_INF_ENC_0001.code,
      );
    }

    return hashed;
  }

  async compare(input: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(input, encrypted);
  }
}
