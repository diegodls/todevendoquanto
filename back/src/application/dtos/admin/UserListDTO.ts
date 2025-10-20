import {
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/PaginationDTO";
import { UserValidProps } from "@/core/domain/User";
import { PropsToString } from "@/core/shared/types/helpers/PropsToString";

export type UserFiltersPropsInput = UserValidProps;

export type UserFiltersPropsKeys = keyof UserFiltersPropsInput;

export type UserListRequestDTO = PaginationProps & UserFiltersPropsInput;

export type UserFiltersQueryInput = PropsToString<UserFiltersPropsInput>;

export type UserListRequestPaginatedQuery = PaginationQueryInput &
  UserFiltersQueryInput;
