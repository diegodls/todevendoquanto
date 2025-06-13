import { CreateUserController } from "../../controllers/express/user/CreateUserController";
import { UserLoginController } from "../../controllers/express/user/UserLoginController";
import { IRoute } from "../IRoute";

type IUserRoutes = [IRoute<CreateUserController>, IRoute<UserLoginController>];

export { IUserRoutes };
