import { HttpMethod } from "@/core/shared/types/HttpMethod";

interface IRouteOBJ<T> {
  method: HttpMethod;
  path: `/${string}`;
  controller: T;
}

export { IRouteOBJ };
