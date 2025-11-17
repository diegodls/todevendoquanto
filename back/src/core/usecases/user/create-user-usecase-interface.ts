import { SignInUserInputDTO } from "@/application/dtos/user/sign-in-dto";
import { User } from "@/prisma";

export interface CreateUserUseCaseInterface {
  execute(data: SignInUserInputDTO): Promise<User | null>;
}
