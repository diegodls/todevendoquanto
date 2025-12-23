import { GenerateUuidInterface } from "@/core/ports/infrastructure/protocols/uuid/generate-uuid-interface";

export class GenerateUuid implements GenerateUuidInterface {
  execute = () => {
    const uuid = crypto.randomUUID();
    return uuid;
  };
}
