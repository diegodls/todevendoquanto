import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export const PaginationDirection = ["asc", "desc"] as const;

export type PaginationDirection = (typeof PaginationDirection)[number];

export type PaginationProps<TOrderBy extends string = string> = {
  page?: number;
  page_size?: number;
  order?: PaginationDirection;
  order_by?: TOrderBy;
};

export type PaginationQueryInput = PropsToString<PaginationProps>;

type PaginatedResponseMeta = {
  page: number;
  page_size: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  total_pages: number;
  total_items: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginatedResponseMeta;
};
