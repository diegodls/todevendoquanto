import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type PaginationProps = {
  page?: number;
  pageSize?: number;
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
