type PaginationDirection = "asc" | "desc";

type GenericOrderBy<TModel> = {
  [K in keyof TModel]?: PaginationDirection;
};

type PaginationInputParamsDTO<T extends string = string> = {
  page?: number;
  page_size?: number;
  order?: PaginationDirection;
  order_by?: T;
};

type PaginationOutputMetaDTO = {
  page: number;
  page_size: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  total_pages: number;
  total_items: number;
};

type PaginationOutputDTO<T> = {
  data: T[];
  meta: PaginationOutputMetaDTO;
};

export {
  GenericOrderBy,
  PaginationDirection,
  PaginationInputParamsDTO,
  PaginationOutputDTO,
};
