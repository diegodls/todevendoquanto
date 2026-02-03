import { User } from "@/core/entities/user/user";
import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type CreateUserInputProps = Pick<User, "name" | "email" | "password">;

export type CreateUserInputDTO = PropsToString<CreateUserInputProps>;

export type CreateUserOutputDTO = Omit<User, "password">;
