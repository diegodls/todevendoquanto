import { IRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { DeleteUserController } from "@/infrastructure/http/express/controllers/admin/DeleteUserController";

type IAdminRoutes = [IRouteOBJ<DeleteUserController>];

export { IAdminRoutes };
