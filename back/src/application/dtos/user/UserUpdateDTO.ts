import { User } from "@/core/domain/User";

type UserUpdateParams = { id: User["id"] };

type UserUpdateInputDTO = Partial<Pick<User, "email" | "name">>;

type UserUpdateOutputDTO = Omit<User, "password"> | null;

export { UserUpdateInputDTO, UserUpdateOutputDTO, UserUpdateParams };
