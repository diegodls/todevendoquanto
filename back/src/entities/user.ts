export enum UserType {
  ADMIN,
  BASIC,
}

export type Permissions = "user-create" | "user-update" | "user-delete";

export type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  type: UserType;
  permissions: Permissions[];
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
      type: UserType["BASIC"],
      permissions: [],
    });
  }

  public with(id: string, name: string, email: string) {
    return new User({
      id,
      name,
      email,
      password: "",
      type: UserType["BASIC"],
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
    return this.props.type;
  }

  public get permissions() {
    return this.props.permissions;
  }
}
