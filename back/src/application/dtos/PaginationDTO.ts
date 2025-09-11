type PaginationInputDTO = {
  page?: number;
  page_size?: number;
  order_by?: string;
  direction?: string;
};

type PaginationOutputDTO<T> = {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
  data: T[];
};

export { PaginationInputDTO, PaginationOutputDTO };
