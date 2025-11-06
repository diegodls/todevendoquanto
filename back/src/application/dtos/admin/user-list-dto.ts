import {
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/pagination-dto";
import { TUserRole, UserValidProps } from "@/core/domain/user";
import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type UserListOrderProps = UserValidProps;

export type UserListOrderPropsKeys = keyof UserListOrderProps;

export type UserValidQueryProps = Partial<
  Pick<UserValidProps, "name" | "email" | "is_active"> & { roles?: TUserRole[] }
>;

type DateFilterProps = {
  created_after?: Date;
  created_before?: Date;
  updated_after?: Date;
  updated_before?: Date;
};

export type UserListQueryProps = UserValidQueryProps & DateFilterProps;

export type UserListQueryInput = PropsToString<UserListQueryProps>;

export type UserListRequestPaginatedQuery = PaginationQueryInput &
  UserListQueryInput;

export type UserListRequestDTO = PaginationProps & UserListQueryProps;
