import { User } from "@/core/domain/User";

type UserUpdateInputDTO = Partial<Pick<User, "email" | "name">>;

type UserUpdateOutputDTO = Omit<User, "password">;

export { UserUpdateInputDTO, UserUpdateOutputDTO };
