import { PropsToString } from "@/core/shared/types/helpers/PropsToString";

const PaginationDirection = {
  asc: "asc",
  desc: "desc",
} as const;

export type TPaginationDirection =
  (typeof PaginationDirection)[keyof typeof PaginationDirection];

//export type PaginationParams<TOrderBy extends string = string> = {
export type PaginationProps = {
  page?: number;
  /*
  page_size?: number;
  order?: TPaginationDirection;
  order_by?: TOrderBy;
  */
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
