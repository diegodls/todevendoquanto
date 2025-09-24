import { IAuthenticatedRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { IUserDeleteByIDController } from "@/core/usecases/authenticated/user/IUserDeleteByIDController";
import { IUserListController } from "@/core/usecases/authenticated/user/IUserListController";
import { IUserUpdateController } from "@/core/usecases/authenticated/user/IUserUpdateController";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

/* //! 
type IAdminRoutes = IAdminRouteOBJ<
  IDeleteUserByIDController | IListUsersController
>[];

type IDeleteUserByIDRoute = IAdminRouteOBJ<IDeleteUserByIDController>;
type IListUsersRoute = IAdminRouteOBJ<IListUsersController>;
type IAdminRoutes = (IDeleteUserByIDRoute | IListUsersRoute)[];
type IAdminRoutes = [
  IAdminRouteOBJ<DeleteUserByIDController>,
  IAdminRouteOBJ<ListUsersController>
];

type IUserDeleteByIDRoute = IAuthenticatedRouteOBJ<IUserDeleteByIDController>;

type IUserListRoute = IAuthenticatedRouteOBJ<IUserListController>;

type IUserUpdate = IAuthenticatedRouteOBJ<IUserUpdateController>;

type IAuthenticatedRoutes = (
  | IUserDeleteByIDRoute
  | IUserListRoute
  | IUserUpdate
)[];

*/

type IAnyAuthenticatedController = IAuthenticatedController<
  any,
  any,
  any,
  any,
  any
>;

type IAnyAuthenticatedRoute =
  IAuthenticatedRouteOBJ<IAnyAuthenticatedController>;

type IAuthenticatedAdminRoutes = IAuthenticatedRouteOBJ<
  IUserDeleteByIDController | IUserListController
>[];

type IAuthenticatedUserRoutes = IAuthenticatedRouteOBJ<IUserUpdateController>[];

type IAuthenticatedRoutes = IAuthenticatedRouteOBJ<
  IUserDeleteByIDController | IUserListController | IUserUpdateController
>[];

export {
  IAnyAuthenticatedController,
  IAnyAuthenticatedRoute,
  IAuthenticatedAdminRoutes,
  IAuthenticatedRoutes,
  IAuthenticatedUserRoutes,
};
