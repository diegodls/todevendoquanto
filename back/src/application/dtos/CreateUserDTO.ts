import { User } from "@/core/domain/User";

type CreateUserInputDTO = {
  name: string;
  email: string;
  password: string;
};

type CreateUserOutputDTO = Omit<User, "password">;

export { CreateUserInputDTO, CreateUserOutputDTO };
