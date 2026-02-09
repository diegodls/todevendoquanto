import {
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/pagination-dto";

export type ListUserOrderProps = {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export type ListUserOrderPropsKeys = keyof ListUserOrderProps;

export type UserValidQueryProps = {
  name: string;
  email: string;
  isActive: boolean;
  roles: string[];
};

type DateFilterProps = {
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
};

export type ListUsersQueryProps = UserValidQueryProps & DateFilterProps;

export type ListUsersQueryInput = ListUsersQueryProps;

export type UserListRequestPaginatedQuery = PaginationQueryInput &
  ListUsersQueryInput;

export type ListUsersRequestDTO = PaginationProps & ListUsersQueryProps;
