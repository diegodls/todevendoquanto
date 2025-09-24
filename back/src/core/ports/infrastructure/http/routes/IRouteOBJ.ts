import { HttpMethod } from "@/core/shared/types/HttpMethod";

interface IPublicRouteOBJ<C> {
  method: HttpMethod;
  path: `/${string}`;
  controller: C;
}

interface IAuthenticatedRouteOBJ<C> {
  method: HttpMethod;
  path: `/${string}`;
  controller: C;
}

export { IAuthenticatedRouteOBJ, IPublicRouteOBJ };
