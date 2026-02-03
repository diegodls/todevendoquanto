import { UserId } from "@/core/entities/shared/types";

export const UserRole = {
  BASIC: "BASIC",
  ADMIN: "ADMIN",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export class User {
  public readonly id: UserId = "";
  public name: string = "";
  public email: string = "";
  public password: string = "";
  public role: UserRoleType = UserRole.BASIC;
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();
  public isActive: boolean = true;

  constructor(props: Partial<User>, id?: UserId) {
    Object.assign(this, props);

    if (!id) {
      this.id = crypto.randomUUID();
    }
  }
}

export type UserValidProps = Partial<Omit<User, "id" | "password">>;

export type UserInvalidProps = Partial<Pick<User, "id" | "password">>;
