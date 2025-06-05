type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface IUserRoutes<T> {
  method: HttpMethod;
  path: string;
  controller: T;
}
