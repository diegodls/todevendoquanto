import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import { UserDeleteByIDControllerType } from "@/core/ports/infrastructure/http/controllers/authenticated/user/user-delete-by-id-controller-type";
import { UserListControllerType } from "@/core/ports/infrastructure/http/controllers/authenticated/user/user-list-controller-type";
import { UserUpdateControllerType } from "@/core/ports/infrastructure/http/controllers/authenticated/user/user-update-controller-type";
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
  UserDeleteByIDControllerType | UserListControllerType
>[];

export type AuthenticatedUserRoutesType =
  AuthenticatedRouteObjInterface<UserUpdateControllerType>[];

export type AuthenticatedRoutesTypes = AuthenticatedRouteObjInterface<
  | UserDeleteByIDControllerType
  | UserListControllerType
  | UserUpdateControllerType
>[];
