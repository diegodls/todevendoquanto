import {
  UserAlreadyActiveError,
  UserAlreadyInactiveError,
  UserCreatedAtRequiredError,
  UserEmailRequiredError,
  UserIdRequiredError,
  UserNameEmptyError,
  UserNameInvalidCharactersError,
  UserNameTooLongError,
  UserNameTooShortError,
  UserPasswordEmptyError,
  UserPasswordRequiredError,
  UserRoleRequiredError,
  UserUpdatedAtRequiredError,
} from "@/core/shared/errors/domain";
import { Email } from "./value-objects/user-email";
import { UserId } from "./value-objects/user-id";
import { UserRole } from "./value-objects/user-role";

export interface CreateUserProps {
  name: string;
  email: string;
  role?: string;
}

export interface UserProps {
  id: UserId;
  name: string;
  email: Email;
  hashedPassword: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export class User {
  private readonly _id: UserId;
  private _name: string;
  private _email: Email;
  private _hashedPassword: string;
  private _role: UserRole;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _isActive: boolean;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._hashedPassword = props.hashedPassword;
    this._role = props.role;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._isActive = props.isActive;

    this.validate();
  }

  public static create(props: CreateUserProps, hashedPassword: string): User {
    if (!props.name || props.name.trim().length === 0) {
      throw new UserNameEmptyError();
    }

    const name = props.name.trim();

    if (name.length < 2) {
      throw new UserNameTooShortError();
    }

    if (name.length > 100) {
      throw new UserNameTooLongError();
    }

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
      throw new UserNameInvalidCharactersError();
    }

    const email = Email.create(props.email);
    const role = props.role ? UserRole.create(props.role) : UserRole.BASIC;

    return new User({
      id: UserId.create(),
      name,
      email,
      hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });
  }

  public static reconstitute(props: UserProps): User {
    return new User(props);
  }

  private validate(): void {
    if (!this._id) {
      throw new UserIdRequiredError();
    }

    if (!this._email) {
      throw new UserEmailRequiredError();
    }

    if (!this._hashedPassword || this._hashedPassword.trim().length === 0) {
      throw new UserPasswordRequiredError();
    }

    if (!this._role) {
      throw new UserRoleRequiredError();
    }

    if (!this._createdAt) {
      throw new UserCreatedAtRequiredError();
    }

    if (!this._updatedAt) {
      throw new UserUpdatedAtRequiredError();
    }
  }

  public get id(): UserId {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): Email {
    return this._email;
  }

  public get hashedPassword(): string {
    return this._hashedPassword;
  }

  public get role(): UserRole {
    return this._role;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public changeName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new UserNameEmptyError();
    }

    const trimmed = newName.trim();

    if (trimmed.length < 2) {
      throw new UserNameTooShortError();
    }

    if (trimmed.length > 100) {
      throw new UserNameTooLongError();
    }

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
      throw new UserNameInvalidCharactersError();
    }

    this._name = trimmed;
    this.touch();
  }

  public changeEmail(newEmail: string): void {
    const email = Email.create(newEmail);
    this._email = email;
    this.touch();
  }

  public changePassword(newHashedPassword: string): void {
    if (!newHashedPassword || newHashedPassword.trim().length === 0) {
      throw new UserPasswordEmptyError();
    }

    this._hashedPassword = newHashedPassword;
    this.touch();
  }

  public promoteToAdmin(): void {
    this._role = UserRole.ADMIN;
    this.touch();
  }

  public demoteToBasic(): void {
    this._role = UserRole.BASIC;
    this.touch();
  }

  public activate(): void {
    if (this._isActive) {
      throw new UserAlreadyActiveError();
    }

    this._isActive = true;
    this.touch();
  }

  public deactivate(): void {
    if (!this._isActive) {
      throw new UserAlreadyInactiveError();
    }

    this._isActive = false;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  public isAdmin(): boolean {
    return this._role.isAdmin();
  }

  public canManageUsers(): boolean {
    return this._role.canManageUsers();
  }

  public canDeleteContent(): boolean {
    return this._role.canDeleteContent();
  }

  public isSameDomain(other: User): boolean {
    return this._email.isSameDomain(other._email);
  }

  public equals(other: User): boolean {
    if (!other) return false;
    return this._id.equals(other._id);
  }

  public toJSON(): object {
    return {
      id: this._id.toString(),
      name: this._name,
      email: this._email.toString(),
      hashedPassword: this._hashedPassword,
      role: this._role.toString(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      isActive: this._isActive,
    };
  }

  public toPublic(): object {
    return {
      id: this._id.toString(),
      name: this._name,
      email: this._email.toString(),
      role: this._role.toString(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      isActive: this._isActive,
    };
  }
}
