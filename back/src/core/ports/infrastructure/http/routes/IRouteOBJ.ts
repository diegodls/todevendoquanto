import { HttpMethod } from "@/core/shared/types/HttpMethod";

export interface IPublicRouteOBJ<C> {
  method: HttpMethod;
  path: `/${string}`;
  controller: C;
}

export interface IAuthenticatedRouteOBJ<C> {
  method: HttpMethod;
  path: `/${string}`;
  controller: C;
}
