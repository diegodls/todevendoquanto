import { IRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { IDeleteUserByIDController } from "@/core/usecases/admin/user/IDeleteUserByIDController";
import { IListUsersController } from "@/core/usecases/admin/user/IListUsersController";

type IAdminRoutes = [
  IRouteOBJ<IDeleteUserByIDController>,
  IRouteOBJ<IListUsersController>
];

export { IAdminRoutes };
