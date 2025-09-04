import { IRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { IDeleteUserByIDController } from "@/core/usecases/admin/IDeleteUserByIDController";

type IAdminRoutes = [IRouteOBJ<IDeleteUserByIDController>];

export { IAdminRoutes };
