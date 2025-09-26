import { AdminService } from "@/application/services/admin/adminService";
import { UserService } from "@/application/services/user/userService";
import {
  IAnyAuthenticatedController,
  IAuthenticatedAdminRoutes,
  IAuthenticatedUserRoutes,
} from "@/core/ports/infrastructure/http/routes/IAuthenticatedRoutes";
import { IAuthenticatedRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { prisma } from "@/core/shared/utils/orm/prisma/prismaClient";
import { UserDeleteByIDController } from "@/infrastructure/http/express/controllers/authenticated/admin/DeleteUserByIDController";
import { UserListController } from "@/infrastructure/http/express/controllers/authenticated/admin/UserListController";
import { UserUpdateController } from "@/infrastructure/http/express/controllers/authenticated/user/UserUpdateController";
import { AdminRepositoryPrisma } from "@/infrastructure/repositories/prisma/AdminRepositoryPrisma";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/UserRepositoryPrisma";

const adminRepository = new AdminRepositoryPrisma(prisma);

const userRepository = new UserRepositoryPrisma(prisma);

const adminService = new AdminService(adminRepository);

const userService = new UserService(userRepository);

const userDeleteController = new UserDeleteByIDController(adminService);

const userListController = new UserListController(adminService);

const userUpdateController = new UserUpdateController(userService);

const makeRoute = <C extends IAnyAuthenticatedController>(
  route: IAuthenticatedRouteOBJ<C>
): IAuthenticatedRouteOBJ<C> => {
  //! REDUNDANTE, poderia ser usado em outros casos, caso fosse necessário o typescript inferir diretamente, mas o problema está lá na hora de fazer o array de rotas no "app.ts > load_XYZ_Routes()", mas fica como aprendizado.
  return {
    path: route.path,
    method: route.method,
    controller: route.controller,
  };
};

const adminRoutes: IAuthenticatedAdminRoutes = [
  makeRoute({
    path: "/admin/users/delete/id",
    method: "delete",
    controller: userDeleteController,
  }),
  makeRoute({
    path: "/admin/users/list",
    method: "get",
    controller: userListController,
  }),
];

const userRoutes: IAuthenticatedUserRoutes = [
  {
    method: "patch",
    path: "/user/update",
    controller: userUpdateController,
  },
];

const authenticatedRoutes = [...adminRoutes, ...userRoutes];

export { authenticatedRoutes };
