import { User, UserValidProps } from "@/core/domain/User";

export type UserUpdateParams = { id: User["id"] };

export type UserUpdateInputDTO = UserValidProps;

export type UserUpdateOutputDTO = Omit<User, "password"> | null;
