import { User, UserValidProps } from "@/core/entities/user";

export type UpdateUserParams = { id: User["id"] };

export type UpdateUserInputDTO = UserValidProps;

export type UpdateUserOutputDTO = Omit<User, "password"> | null;
