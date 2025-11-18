import { User } from "@/core/entities/user";

export type LoginUserInputDTO = {
  email: string;
  password: string;
};

export type LoginUserOutputDTO = {
  token: string;
};

export interface LoginUserPayload {
  email: User["email"];
  role: User["role"];
}
