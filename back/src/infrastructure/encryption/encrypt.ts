import { EncryptInterface } from "@/core/ports/infrastructure/encryption/encrypt-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { encryptErrorsCodes } from "@/infrastructure/errors/codes/encryption/encrypt-errors";
import bcrypt from "bcrypt";

export class Encrypt implements EncryptInterface {
  public async execute(input: string): Promise<string> {
    const saltRounds = 12;

    const encryptedInput = await bcrypt.hash(input, saltRounds);

    if (!encryptedInput) {
      throw new InternalError(
        "Internal Server Error!",
        {},
        encryptErrorsCodes.E_0_INF_ENC_0001.code
      );
    }

    return encryptedInput;
  }
}
