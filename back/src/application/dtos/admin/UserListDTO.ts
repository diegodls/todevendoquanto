import {
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/PaginationDTO";
import { PropsToString } from "@/core/shared/types/helpers/PropsToString";

export type UserFiltersPropsInput = { name?: string }; // UserFiltersPropsInput

export type UserFiltersPropsKeys = keyof UserFiltersPropsInput;

export type UserListRequestDTO = PaginationProps & UserFiltersPropsInput;

export type UserFiltersQueryInput = PropsToString<UserFiltersPropsInput>;

export type UserListRequestPaginatedQuery = PaginationQueryInput &
  UserFiltersQueryInput;
