import { IRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { DeleteUserByIDController } from "@/infrastructure/http/express/controllers/admin/DeleteUserByIDController";

type IAdminRoutes = [IRouteOBJ<DeleteUserByIDController>];

export { IAdminRoutes };
