import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import { DeleteUserByIDControllerType } from "@/core/ports/infrastructure/http/controllers/user/delete-user-by-id-controller-type";
import { UserListControllerType } from "@/core/ports/infrastructure/http/controllers/user/list-user-controller-type";
import { UserUpdateControllerType } from "@/core/ports/infrastructure/http/controllers/user/update-user-controller-type";
import { AuthenticatedRouteObjInterface } from "@/core/ports/infrastructure/http/routes/route-obj-interface";

export type AnyAuthenticatedControllerType = AuthenticatedControllerInterface<
  any,
  any,
  any,
  any,
  any
>;

export type AnyAuthenticatedRouteType =
  AuthenticatedRouteObjInterface<AnyAuthenticatedControllerType>;

export type AuthenticatedAdminRoutesType = AuthenticatedRouteObjInterface<
  DeleteUserByIDControllerType | UserListControllerType
>[];

export type AuthenticatedUserRoutesType =
  AuthenticatedRouteObjInterface<UserUpdateControllerType>[];

export type AuthenticatedRoutesTypes = AuthenticatedRouteObjInterface<
  | DeleteUserByIDControllerType
  | UserListControllerType
  | UserUpdateControllerType
>[];
