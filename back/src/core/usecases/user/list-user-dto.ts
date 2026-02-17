import {
  PaginatedResponse,
  PaginationProps,
  PaginationQueryStringInput,
} from "@/application/dtos/shared/pagination-dto";
import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type ListUserSortProps = {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export type ListUserSortPropsKeys = keyof ListUserSortProps;

export type UserListFilterProps = {
  name?: string;
  email?: string;
  isActive?: boolean;
  roles?: string[];
};

type DateFilterProps = {
  created_after?: Date;
  created_before?: Date;
  updated_after?: Date;
  updated_before?: Date;
};

export type ListUsersFilterProps = UserListFilterProps & DateFilterProps;

export type ListUsersFilterQueryStringInput =
  PropsToString<ListUsersFilterProps>;

export type ListUsersRequestQueryProps = PaginationProps & ListUsersFilterProps;

export type ListUsersRequestPaginatedQuery = PaginationQueryStringInput &
  ListUsersFilterQueryStringInput;

export type ListUsersInputDTO = ListUsersRequestQueryProps & {
  requestingUserId: string;
};

export type ListUserOutputProps = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListUserOutputDTO = PaginatedResponse<ListUserOutputProps>;
/*

import {
  PaginatedResponse,
  PaginationProps,
} from "@/application/dtos/shared/pagination-dto";

export type ListUsersQueryInput = {
  name?: string;
  email?: string;
  isActive?: boolean;
  roles?: string[];
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
};

export type UserListRequestPaginatedQuery = PaginationProps &
  ListUsersQueryInput;

export type ListUsersInputDTO = ListUsersQueryInput &
  PaginationProps & {
    requestingUserId: string;
  };

export type ListUserOutputProps = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListUserOutputDTO = PaginatedResponse<ListUserOutputProps>;


*/
