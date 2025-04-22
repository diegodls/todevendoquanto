/*const Role: { [x: string]: "BASIC" | "ADMIN" } = {
  BASIC: "BASIC",
  ADMIN: "ADMIN",
};

export type UserRole = (typeof Role)[keyof typeof Role];
*/

export enum UserRole {
  BASIC = "BASIC",
  ADMIN = "ADMIN",
}

export type UserPermissions = "user-create" | "user-update" | "user-delete";

export type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole | null;
  permissions: UserPermissions[];
};

export class User {
  private constructor(readonly props: UserProps) {}

  public static create(
    name: UserProps["name"],
    email: UserProps["email"],
    password: UserProps["password"]
  ) {
    return new User({
      id: crypto.randomUUID().toString(),
      name,
      email,
      password,
      role: UserRole.BASIC,
      permissions: [],
    });
  }

  public static with(id: string, name: string, email: string) {
    return new User({
      id,
      name,
      email,
      password: "",
      role: UserRole.BASIC,
      permissions: [],
    });
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get password() {
    return this.props.password;
  }

  public get type() {
    return this.props.role;
  }

  public get permissions() {
    return this.props.permissions;
  }
}
