import {
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/PaginationDTO";
import { UserValidProps } from "@/core/domain/User";
import { PaginationPropsToQueryString } from "@/core/shared/types/helpers/PaginationPropsToQueryString";

export type UserFiltersPropsInput = Pick<UserValidProps, "name">;

export type UserFiltersPropsKeys = keyof UserFiltersPropsInput;

export type UserListRequestFiltersProps = PaginationProps &
  UserFiltersPropsInput;

export type UserFiltersQueryInput =
  PaginationPropsToQueryString<UserFiltersPropsInput>;

export type UserListRequestPaginatedQuery = PaginationQueryInput &
  UserFiltersQueryInput;
