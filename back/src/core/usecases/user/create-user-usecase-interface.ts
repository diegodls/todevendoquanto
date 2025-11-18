import { CreateUserInputDTO } from "@/core/usecases/user/create-user-dto";
import { User } from "@/prisma";

export interface CreateUserUseCaseInterface {
  execute(data: CreateUserInputDTO): Promise<User | null>;
}
