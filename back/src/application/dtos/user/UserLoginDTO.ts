import { User } from "@/core/domain/User";

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

export { UserLoginInputDTO, UserLoginOutputDTO, UserLoginPayload };
