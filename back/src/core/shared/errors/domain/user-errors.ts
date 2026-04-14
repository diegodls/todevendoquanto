import { DomainError } from "../domain-error";

export class UserError extends DomainError {}

export class UserNameEmptyError extends UserError {
  constructor() {
    super("Name cannot be empty");
  }
}

export class UserNameTooShortError extends UserError {
  constructor() {
    super("Name must have at least 2 characters");
  }
}

export class UserNameTooLongError extends UserError {
  constructor() {
    super("Name exceeds maximum length of 100 characters");
  }
}

export class UserNameInvalidCharactersError extends UserError {
  constructor() {
    super("Name contains invalid characters");
  }
}

export class UserIdRequiredError extends UserError {
  constructor() {
    super("User ID is required");
  }
}

export class UserEmailRequiredError extends UserError {
  constructor() {
    super("User email is required");
  }
}

export class UserPasswordRequiredError extends UserError {
  constructor() {
    super("User password is required");
  }
}

export class UserRoleRequiredError extends UserError {
  constructor() {
    super("User role is required");
  }
}

export class UserCreatedAtRequiredError extends UserError {
  constructor() {
    super("User createdAt is required");
  }
}

export class UserUpdatedAtRequiredError extends UserError {
  constructor() {
    super("User updatedAt is required");
  }
}

export class UserPasswordEmptyError extends UserError {
  constructor() {
    super("Password cannot be empty");
  }
}

export class UserAlreadyActiveError extends UserError {
  constructor() {
    super("User is already active");
  }
}

export class UserAlreadyInactiveError extends UserError {
  constructor() {
    super("User is already inactive");
  }
}
