import { UserValidPropsToFilter } from "@/core/domain/User";

type ListUsersControllerFilters = UserValidPropsToFilter;

type PaginationDirection = "asc" | "desc";

type GenericOrderBy<TModel> = {
  [K in keyof TModel]?: PaginationDirection;
};

type PaginationInputDTO<T, F> = {
  page?: number;
  page_size?: number;
  order_by?: GenericOrderBy<T>;
  filters?: F;
};

// ! TALVEZ SEPARAR A PAGINAÇÃO EM UMA PROPS "META"

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
  ListUsersControllerFilters,
  PaginationDirection,
  PaginationInputDTO,
  PaginationOutputDTO,
};
