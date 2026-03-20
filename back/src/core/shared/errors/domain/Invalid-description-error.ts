import { DomainError } from "@/core/shared/errors/domain/domain-error";

export class InvalidDescriptionError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
