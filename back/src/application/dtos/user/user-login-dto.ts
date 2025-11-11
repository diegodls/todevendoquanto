import { User } from "@/core/entities/user";

export type UserLoginInputDTO = {
  email: string;
  password: string;
};

export type UserLoginOutputDTO = {
  token: string;
};

export interface UserLoginPayload {
  email: User["email"];
  role: User["role"];
}
