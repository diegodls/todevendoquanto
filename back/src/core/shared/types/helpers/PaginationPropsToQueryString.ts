export type PaginationPropsToQueryString<T> = {
  [K in keyof T]: string;
};
