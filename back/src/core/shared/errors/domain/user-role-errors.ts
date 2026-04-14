import { DomainError } from "../domain-error";

export class UserRoleError extends DomainError {}

export class UserRoleEmptyError extends UserRoleError {
  constructor() {
    super("Role cannot be empty");
  }
}

export class InvalidUserRoleError extends UserRoleError {
  constructor(role: string, validRoles: readonly string[]) {
    super(`Invalid role: ${role}. Valid roles are: ${validRoles.join(", ")}`);
  }
}
