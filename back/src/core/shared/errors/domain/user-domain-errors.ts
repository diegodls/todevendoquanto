import { DomainError } from "@/core/shared/errors/domain/domain-error";

export class UserNameEmptyError extends DomainError {}
export class UserNameTooShortError extends DomainError {}
export class UserNameTooLongError extends DomainError {}
export class UserNameInvalidCharactersError extends DomainError {}
export class UserIdRequiredError extends DomainError {}
export class UserEmailRequiredError extends DomainError {}
export class UserPasswordRequiredError extends DomainError {}
export class UserRoleRequiredError extends DomainError {}
export class UserCreatedAtRequiredError extends DomainError {}
export class UserUpdatedAtRequiredError extends DomainError {}
export class UserHashedPasswordEmptyError extends DomainError {}
export class UserAlreadyActiveError extends DomainError {}
export class UserAlreadyInactiveError extends DomainError {}
