import { User, UserValidProps } from "@/core/entities/user";
import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type UpdateUserInputProps = Pick<User, "id">;

export type UpdateUserInputParams = PropsToString<UpdateUserInputProps>;

export type UpdateUserInputDTO = UserValidProps;

export type UpdateUserOutputDTO = Omit<User, "password"> | null;
