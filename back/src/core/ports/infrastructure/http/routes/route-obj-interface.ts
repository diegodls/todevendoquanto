import { HttpMethod } from "@/core/shared/types/http-method";

export interface PublicRouteObjInterface<C> {
  method: HttpMethod;
  path: `/${string}`;
  controller: C;
}

export interface AuthenticatedRouteObjInterface<C> {
  method: HttpMethod;
  path: `/${string}`;
  controller: C;
}
