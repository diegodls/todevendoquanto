import { User } from "@/core/domain/User";

type UserSignInInputDTO = {
  name: string;
  email: string;
  password: string;
};

type UserSignInOutputDTO = Omit<User, "password">;

export { UserSignInInputDTO, UserSignInOutputDTO };
