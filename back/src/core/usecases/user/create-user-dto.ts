import { User } from "@/core/entities/user";

export type CreateUserInputDTO = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserOutputDTO = Omit<User, "password">;
