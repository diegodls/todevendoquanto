import { AdminService } from "@/application/services/admin-service";
import { UserService } from "@/application/services/user-service";
import {
  AnyAuthenticatedControllerType,
  AuthenticatedAdminRoutesType,
  AuthenticatedUserRoutesType,
} from "@/core/ports/infrastructure/http/routes/authenticated-routes-type";
import { AuthenticatedRouteObjInterface } from "@/core/ports/infrastructure/http/routes/route-obj-interface";
import { prisma } from "@/core/shared/utils/orm/prisma/prisma-client";
import { UserDeleteByIDController } from "@/infrastructure/http/express/controllers/authenticated/admin/user-delete-by-idcontroller";
import { UserListController } from "@/infrastructure/http/express/controllers/authenticated/admin/user-list-controller";
import { UserUpdateController } from "@/infrastructure/http/express/controllers/authenticated/user/user-update-controller";
import { AdminRepositoryPrisma } from "@/infrastructure/repositories/prisma/admin-repository-prisma";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";

const adminRepository = new AdminRepositoryPrisma(prisma);

const userRepository = new UserRepositoryPrisma(prisma);

const adminService = new AdminService(adminRepository);

const userService = new UserService(userRepository);

const userDeleteController = new UserDeleteByIDController(adminService);

const userListController = new UserListController(adminService);

const userUpdateController = new UserUpdateController(userService);

const makeRoute = <C extends AnyAuthenticatedControllerType>(
  route: AuthenticatedRouteObjInterface<C>
): AuthenticatedRouteObjInterface<C> => {
  //! REDUNDANTE, poderia ser usado em outros casos, caso fosse necessário o typescript inferir diretamente, mas o problema está lá na hora de fazer o array de rotas no "app.ts > load_XYZ_Routes()", mas fica como aprendizado.
  return {
    path: route.path,
    method: route.method,
    controller: route.controller,
  };
};

const adminRoutes: AuthenticatedAdminRoutesType = [
  makeRoute({
    path: "/users/delete/:id",
    method: "delete",
    controller: userDeleteController,
  }),
  makeRoute({
    path: "/users",
    method: "get",
    controller: userListController,
  }),
];

const userRoutes: AuthenticatedUserRoutesType = [
  {
    method: "patch",
    path: "/users/update/:id",
    controller: userUpdateController,
  },
];

export const authenticatedRoutes = [...adminRoutes, ...userRoutes];
