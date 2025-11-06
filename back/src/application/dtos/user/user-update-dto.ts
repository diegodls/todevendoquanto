import { User, UserValidProps } from "@/core/domain/user";

export type UserUpdateParams = { id: User["id"] };

export type UserUpdateInputDTO = UserValidProps;

export type UserUpdateOutputDTO = Omit<User, "password"> | null;
