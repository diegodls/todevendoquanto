import { HttpMethod } from "@/core/shared/types/HttpMethod";

interface IRouteOBJ<C> {
  method: HttpMethod;
  path: `/${string}`;
  controller: C;
}

export { IRouteOBJ };
