import {
  PaginatedResponse,
  PaginationRequestProps,
  PaginationRequestQueryProps,
} from "@/application/dtos/shared/pagination-dto";
import {
  PropsToStringAssertive,
  PropsToStringOptional,
} from "@/core/shared/types/helpers/props-to-string";

export type ListUsersFiltersOptions = {
  name?: string;
  email?: string;
  isActive?: boolean;
  roles?: string[];
  created_after?: Date;
  created_before?: Date;
  updated_after?: Date;
  updated_before?: Date;
};

export type ListUsersFilterQueryParams =
  PropsToStringOptional<ListUsersFiltersOptions>;

export type ListUsersOrderByOptions = {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export const ListUserOrderDirectionOptions = ["asc", "desc"] as const;

export type ListUsersOrderDirection =
  (typeof ListUserOrderDirectionOptions)[number];

export const listUsersOrderOptionsMap: Record<
  keyof ListUsersOrderByOptions,
  true
> = {
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
};

export const ListUsersOrderByOptionsArrKey = Object.keys(
  listUsersOrderOptionsMap,
) as (keyof ListUsersOrderByOptions)[];

export type ListUsersOrderRequestOptionalProps = {
  order?: ListUsersOrderDirection;
  orderBy?: keyof PropsToStringAssertive<ListUsersOrderByOptions>;
};

export type ListUsersOrderRequestProps = {
  order: ListUsersOrderDirection;
  orderBy: keyof PropsToStringAssertive<ListUsersOrderByOptions>;
};

export type ListUsersOrderQueryParams =
  PropsToStringOptional<ListUsersOrderRequestOptionalProps>;

export type ListUsersPaginatedQueryParams = PaginationRequestQueryProps &
  ListUsersFilterQueryParams;

export type ListUsersHttpRequestProps = ListUsersFiltersOptions &
  PaginationRequestProps &
  ListUsersOrderRequestOptionalProps;

export type ListUsersInputDTO = ListUsersHttpRequestProps & {
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
