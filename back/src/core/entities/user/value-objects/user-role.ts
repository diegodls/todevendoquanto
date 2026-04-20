import {
  InvalidUserRoleError,
  UserRoleEmptyError,
} from "@/core/shared/errors/domain";

export class UserRole {
  private static readonly VALID_ROLES = ["BASIC", "ADMIN"] as const;

  public static readonly BASIC = new UserRole("BASIC");
  public static readonly ADMIN = new UserRole("ADMIN");

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(role: string): UserRole {
    if (!role || role.trim().length === 0) {
      throw new UserRoleEmptyError();
    }

    const normalized = role.trim().toUpperCase();

    if (!this.isValidRole(normalized)) {
      throw new InvalidUserRoleError(role, this.VALID_ROLES);
    }

    switch (normalized) {
      case "BASIC":
        return UserRole.BASIC;
      case "ADMIN":
        return UserRole.ADMIN;
      default:
        throw new InvalidUserRoleError(role, this.VALID_ROLES);
    }
  }

  private static isValidRole(role: string): boolean {
    return this.VALID_ROLES.includes(role as any);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: UserRole): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public isAdmin(): boolean {
    return this.value === "ADMIN";
  }

  public isBasic(): boolean {
    return this.value === "BASIC";
  }

  public canManageUsers(): boolean {
    return this.isAdmin();
  }

  public canDeleteContent(): boolean {
    return this.isAdmin();
  }

  public canEditOwnContent(): boolean {
    return true;
  }

  public toJSON(): string {
    return this.value;
  }
}
