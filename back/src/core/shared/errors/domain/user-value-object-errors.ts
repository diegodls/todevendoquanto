import { DomainError } from "@/core/shared/errors/domain/domain-error";

export class PasswordEmptyError extends DomainError {}
export class PasswordTooShortError extends DomainError {}
export class PasswordTooLongError extends DomainError {}
export class PasswordTooCommonError extends DomainError {}
export class PasswordMissingUppercaseError extends DomainError {}
export class PasswordMissingLowercaseError extends DomainError {}
export class PasswordMissingNumberError extends DomainError {}
export class PasswordMissingSpecialCharacterError extends DomainError {}
export class EmailEmptyError extends DomainError {}
export class InvalidEmailFormatError extends DomainError {}
export class EmailTooLongError extends DomainError {}
export class UserIdEmptyError extends DomainError {}
export class InvalidUserIdError extends DomainError {}
export class UserRoleEmptyError extends DomainError {}
export class InvalidUserRoleError extends DomainError {}
