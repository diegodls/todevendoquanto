import { HttpMethod } from "@/core/shared/types/HttpMethod";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

interface IAdminRouteOBJ<C> {
  tag: string;
  method: HttpMethod;
  path: `/${string}`;
  controller: C;
}

interface IRouteOBJ<C> {
  method: HttpMethod;
  path: `/${string}`;
  controller: C;
}

function createRoute<
  C extends IAuthenticatedController<any, any, any, any, any>
>(routObj: IAdminRouteOBJ<C>): IAdminRouteOBJ<C> {
  return routObj;
}

export { createRoute, IAdminRouteOBJ, IRouteOBJ };
