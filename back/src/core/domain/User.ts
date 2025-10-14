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

type UserValidProps = Partial<Omit<User, "id" | "password">>;

type UserInvalidProps = Partial<Pick<User, "id" | "password">>;

type UserValidKeysToChange = keyof UserValidProps;

type UserValidKeysToFilter = keyof UserValidProps;
type UserInvalidKeysToFilter = keyof UserInvalidProps;

type UserValidKeysToOrderBy = keyof UserValidProps;
type UserInvalidKeysToOrderBy = keyof UserInvalidProps;

export {
  User,
  UserInvalidKeysToFilter,
  UserInvalidKeysToOrderBy,
  UserRole,
  UserValidKeysToChange,
  UserValidKeysToFilter,
  UserValidKeysToOrderBy,
};
