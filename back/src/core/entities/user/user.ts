// core/entities/user/user.entity.ts

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
      throw new Error("Name cannot be empty");
    }

    const name = props.name.trim();

    if (name.length < 2) {
      throw new Error("Name must have at least 2 characters");
    }

    if (name.length > 100) {
      throw new Error("Name exceeds maximum length of 100 characters");
    }

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
      throw new Error("Name contains invalid characters");
    }

    const email = Email.create(props.email);
    const role = props.role ? UserRole.create(props.role) : UserRole.BASIC;

    return new User({
      id: UserId.create(),
      name,
      email,
      hashedPassword: hashedPassword,
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
      throw new Error("User ID is required");
    }

    if (!this._email) {
      throw new Error("User email is required");
    }

    if (!this._hashedPassword || this._hashedPassword.trim().length === 0) {
      throw new Error("User password is required");
    }

    if (!this._role) {
      throw new Error("User role is required");
    }

    if (!this._createdAt) {
      throw new Error("User createdAt is required");
    }

    if (!this._updatedAt) {
      throw new Error("User updatedAt is required");
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
      throw new Error("Name cannot be empty");
    }

    const trimmed = newName.trim();

    if (trimmed.length < 2) {
      throw new Error("Name must have at least 2 characters");
    }

    if (trimmed.length > 100) {
      throw new Error("Name exceeds maximum length of 100 characters");
    }

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
      throw new Error("Name contains invalid characters");
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
      throw new Error("Password cannot be empty");
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
      throw new Error("User is already active");
    }

    this._isActive = true;
    this.touch();
  }

  public deactivate(): void {
    if (!this._isActive) {
      throw new Error("User is already inactive");
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
