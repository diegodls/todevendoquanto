import { User, UserValidProps } from "@/core/domain/User";

type UserUpdateParams = { id: User["id"] };

type UserUpdateInputDTO = UserValidProps;

type UserUpdateOutputDTO = Omit<User, "password"> | null;

export { UserUpdateInputDTO, UserUpdateOutputDTO, UserUpdateParams };
