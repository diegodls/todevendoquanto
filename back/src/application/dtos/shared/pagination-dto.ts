import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type PaginationSort<TOrderBy extends string = string> = {
  order?: PaginationDirection;
  orderBy?: TOrderBy;
};
export const PaginationDirection = ["asc", "desc"] as const;

export type PaginationDirection = (typeof PaginationDirection)[number];

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type PaginationProps<T extends string = string> = PaginationSort<T> &
  PaginationParams;

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
