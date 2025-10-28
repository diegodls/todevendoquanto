import {
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/PaginationDTO";
import { UserValidProps } from "@/core/domain/User";
import { PropsToString } from "@/core/shared/types/helpers/PropsToString";

export type UserListOrderProps = UserValidProps;

export type UserValidQueryProps = Partial<
  Pick<UserValidProps, "name" | "email" | "is_active" | "role">
>;

export type UserListOrderPropsKeys = keyof UserListOrderProps;

export type UserListQueryProps = UserValidQueryProps & {
  created_at_from?: Date;
  created_at_to?: Date;
  updated_at_from?: Date;
  updated_at_to?: Date;
};

export type UserListQueryInput = PropsToString<UserListQueryProps>;

export type UserListRequestPaginatedQuery = PaginationQueryInput &
  UserListQueryInput;

export type UserListRequestDTO = PaginationProps & UserListQueryProps;
