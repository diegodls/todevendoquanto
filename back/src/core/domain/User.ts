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
*/

enum UserRole {
  BASIC = "BASIC",
  ADMIN = "ADMIN",
}

type UserValidPropsToChange = Partial<
  Pick<User, "name" | "email" | "role" | "is_active">
>;

type UserValidPropsToFilter = Partial<Omit<User, "password">>;

type UserValidPropsToOrderBy = Partial<Omit<User, "password">>;

class User {
  public readonly id: string = "";
  public name: string = "";
  public email: string = "";
  public password: string = "";
  public role: UserRole = UserRole.BASIC;
  public created_at: Date = new Date();
  public updated_at: Date = new Date();
  public is_active: boolean = true;

  constructor(props: Partial<User>, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = crypto.randomUUID();
    }
  }
}

export {
  User,
  UserRole,
  UserValidPropsToChange,
  UserValidPropsToFilter,
  UserValidPropsToOrderBy,
};
