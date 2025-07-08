import { DeleteUserController } from "../../controllers/express/admin/DeleteUserController";
import { IRoute } from "../IRoute";

type IAdminRoutes = [IRoute<DeleteUserController>];

export { IAdminRoutes };
