import { IAdminRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { IDeleteUserByIDController } from "@/core/usecases/admin/user/IDeleteUserByIDController";
import { IListUsersController } from "@/core/usecases/admin/user/IListUsersController";

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
*/

type IDeleteUserByIDRoute = IAdminRouteOBJ<IDeleteUserByIDController> & {
  tag: "deleteUser"; // necessário para o TS saber diferenciar na hora de registrar as rotas lá no app
};
type IListUsersRoute = IAdminRouteOBJ<IListUsersController> & {
  tag: "listUser";
};

type IAdminRoutes = (IDeleteUserByIDRoute | IListUsersRoute)[];

export { IAdminRoutes };
