import { User } from "@/core/entities/user/user";

export type LoginUserPayloadType = Pick<User, "email" | "role">;

export type LoginUserInputQuery = {
  email: string;
  password: string;
};

export type LoginUserInputDTO = Pick<User, "email" | "password">;

export type LoginUserOutputDTO = {
  token: string;
};
