import { User } from "@/core/entities/user";

export type SignInUserInputDTO = {
  name: string;
  email: string;
  password: string;
};

export type SignInUserOutputDTO = Omit<User, "password">;
