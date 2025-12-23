/*
const Role: { [x: string]: "BASIC" | "ADMIN" } = {
  BASIC: "BASIC",
  ADMIN: "ADMIN",
};

export type UserRole = (typeof Role)[keyof typeof Role];

export enum UserRole {
  BASIC = "BASIC",
  ADMIN = "ADMIN",
}

enum UserRole {
  BASIC = "BASIC",
  ADMIN = "ADMIN",
}
*/

export const UserRole = {
  BASIC: "BASIC",
  ADMIN: "ADMIN",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export class User {
  public readonly id: string = "";
  public name: string = "";
  public email: string = "";
  public password: string = "";
  public role: UserRoleType = UserRole.BASIC;
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();
  public isActive: boolean = true;

  constructor(props: Partial<User>, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = crypto.randomUUID();
    }
  }
}

export type UserValidProps = Partial<Omit<User, "id" | "password">>;

export type UserInvalidProps = Partial<Pick<User, "id" | "password">>;
