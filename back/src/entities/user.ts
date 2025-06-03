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

export enum UserRole {
  BASIC = "BASIC",
  ADMIN = "ADMIN",
}

export type UserProps = {
  readonly id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export class User {
  public readonly id: string = "";
  public name: string = "";
  public email: string = "";
  public password: string = "";
  public role: UserRole = UserRole.BASIC;

  constructor(props: Partial<User>, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = crypto.randomUUID();
    }
  }
}
