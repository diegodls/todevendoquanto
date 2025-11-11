import { User } from "@/core/entities/user";

export type UserSignInInputDTO = {
  name: string;
  email: string;
  password: string;
};

export type UserSignInOutputDTO = Omit<User, "password">;
