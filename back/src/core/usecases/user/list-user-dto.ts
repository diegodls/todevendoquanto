import {
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/pagination-dto";
import { UserRoleType, UserValidProps } from "@/core/entities/user";
import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type UserListOrderProps = UserValidProps;

export type UserListOrderPropsKeys = keyof UserListOrderProps;

export type UserValidQueryProps = Partial<
  Pick<UserValidProps, "name" | "email" | "is_active"> & {
    roles?: UserRoleType[];
  }
>;

type DateFilterProps = {
  created_after?: Date;
  created_before?: Date;
  updated_after?: Date;
  updated_before?: Date;
};

export type ListUsersQueryProps = UserValidQueryProps & DateFilterProps;

export type ListUsersQueryInput = PropsToString<ListUsersQueryProps>;

export type UserListRequestPaginatedQuery = PaginationQueryInput &
  ListUsersQueryInput;

export type ListUsersRequestDTO = PaginationProps & ListUsersQueryProps;
