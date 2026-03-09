import { PropsToStringOptional } from "@/core/shared/types/helpers/props-to-string";

export type PaginationRequestProps = {
  page?: number;
  pageSize?: number;
};

export type PaginationRequestQueryProps =
  PropsToStringOptional<PaginationRequestProps>;

export type PaginationDTO = {
  page: number;
  pageSize: number;
};

export type PaginatedResponseMeta = {
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
