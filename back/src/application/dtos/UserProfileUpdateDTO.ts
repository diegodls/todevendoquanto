import { User } from "@/core/domain/User";

type UserProfileUpdateInputDTO = Partial<Pick<User, "email" | "name">>;

type UserProfileUpdateOutputDTO = Omit<User, "password">;

export { UserProfileUpdateInputDTO, UserProfileUpdateOutputDTO };
