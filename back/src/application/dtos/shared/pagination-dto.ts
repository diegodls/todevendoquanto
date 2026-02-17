import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export const PaginationDirection = ["asc", "desc"] as const;

export type PaginationDirection = (typeof PaginationDirection)[number];

export type PaginationProps<TOrderBy extends string = string> = {
  page?: number;
  pageSize?: number;
  order?: PaginationDirection;
  orderBy?: TOrderBy;
};

export type PaginationQueryStringInput = PropsToString<PaginationProps>;

type PaginatedResponseMeta = {
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  totalItems: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginatedResponseMeta;
};
