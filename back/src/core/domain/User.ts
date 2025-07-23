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

type BearerToken = `Bearer ${string}`;

type CreateUserInputDTO = {
  name: string;
  email: string;
  password: string;
};

type CreateUserOutputDTO = Omit<User, "password">;

type DeleteUserInputDTO = {
  id: string;
};

type DeleteUserOutputDTO = {
  deletedId: string;
};

type UserLoginInputDTO = {
  email: string;
  password: string;
};

type UserLoginOutputDTO = {
  token: string;
};

interface UserLoginPayload {
  email: User["email"];
  role: User["role"];
}

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
  // ! ADICIONAR O CREATED_AT
  // ! ADICIONAR O UPDATED_AT

  constructor(props: Partial<User>, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = crypto.randomUUID();
    }
  }
}

export {
  CreateUserInputDTO,
  CreateUserOutputDTO,
  DeleteUserInputDTO,
  DeleteUserOutputDTO,
  User,
  UserLoginInputDTO,
  UserLoginOutputDTO,
  UserLoginPayload,
  UserRole,
};
