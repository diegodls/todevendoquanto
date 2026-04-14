import { DomainError } from "../domain-error";

export class UserIdError extends DomainError {}

export class UserIdEmptyError extends UserIdError {
  constructor() {
    super("UserId cannot be empty");
  }
}

export class InvalidUserIdError extends UserIdError {
  constructor() {
    super("UserId must be a valid UUID v4");
  }
}
