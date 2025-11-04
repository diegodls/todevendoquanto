import { User } from "@/core/domain/User";

export type UserSignInInputDTO = {
  name: string;
  email: string;
  password: string;
};

export type UserSignInOutputDTO = Omit<User, "password">;
