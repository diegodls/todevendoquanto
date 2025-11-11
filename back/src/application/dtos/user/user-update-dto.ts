import { User, UserValidProps } from "@/core/entities/user";

export type UserUpdateParams = { id: User["id"] };

export type UserUpdateInputDTO = UserValidProps;

export type UserUpdateOutputDTO = Omit<User, "password"> | null;
