import {
  PaginatedResponse,
  PaginationProps,
  PaginationQueryStringInput,
} from "@/application/dtos/shared/pagination-dto";
import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export const ListUserOrderDirectionOptions = ["asc", " desc"] as const;

export type ListUserOrderDirection =
  (typeof ListUserOrderDirectionOptions)[number];

export type ListUserOrderByPropsA = {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export const listUserOrderByPropsMap: Record<
  keyof ListUserOrderByPropsA,
  true
> = {
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
};

export type ListUserSortPropsKeys = keyof ListUserOrderByPropsA;

export const ListUserOrderByPropsArrKey = Object.keys(
  listUserOrderByPropsMap,
) as ListUserSortPropsKeys[];

export type ListUserOrderProps = {
  order?: ListUserOrderDirection;
  orderBy?: keyof PropsToString<ListUserOrderByPropsA>;
};

export type ListUserFilterProps = {
  name?: string;
  email?: string;
  isActive?: boolean;
  roles?: string[];
};

type ListUserDateFilterProps = {
  created_after?: Date;
  created_before?: Date;
  updated_after?: Date;
  updated_before?: Date;
};

export type ListUsersFilterProps = ListUserFilterProps &
  ListUserDateFilterProps;

export type ListUsersFilterQueryStringInput =
  PropsToString<ListUsersFilterProps>;

export type ListUsersRequestPaginatedQuery = PaginationQueryStringInput &
  ListUsersFilterQueryStringInput;

export type ListUsersRequestQueryProps = ListUsersFilterProps &
  ListUserOrderDirection &
  PaginationProps &
  ListUserOrderByPropsArrKey;

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
