import { User } from "@/core/domain/User";

type ListUsersControllerFilters = {
  role?: User["role"];
  is_active?: boolean;
  email?: string;
};

type PaginationDirection = "asc" | "desc";

type GenericOrderBy<TModel> = {
  [K in keyof TModel]?: PaginationDirection;
};

type PaginationInputDTO<T, F> = {
  page?: number;
  page_size?: number;
  order_by?: GenericOrderBy<T>;
  direction?: PaginationDirection;
  filters?: F;
};

type PaginationOutputDTO<T> = {
  page: number;
  next_page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
  data: T[];
};

export {
  GenericOrderBy,
  ListUsersControllerFilters,
  PaginationDirection,
  PaginationInputDTO,
  PaginationOutputDTO,
};
