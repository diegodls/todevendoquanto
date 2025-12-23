import { User } from "@/core/entities/user";
import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type DeleteUserByIDProps = Pick<User, "id">;

export type DeleteUserByIDInputDTO = DeleteUserByIDProps;

export type DeleteUserByIDQueryInput = PropsToString<DeleteUserByIDInputDTO>;

export type DeleteUserByIDOutputDTO = DeleteUserByIDProps;
