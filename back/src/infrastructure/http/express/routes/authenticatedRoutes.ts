import { AdminService } from "@/application/services/admin/adminService";
import { IAuthenticatedRoutes } from "@/core/ports/infrastructure/http/routes/IAuthenticatedRoutes";
import { prisma } from "@/core/shared/utils/orm/prisma/prismaClient";
import { UserDeleteByIDController } from "@/infrastructure/http/express/controllers/authenticated/admin/DeleteUserByIDController";
import { UserListController } from "@/infrastructure/http/express/controllers/authenticated/admin/UserListController";

import { UserUpdateController } from "@/infrastructure/http/express/controllers/authenticated/user/UserUpdateController";

import { AdminRepositoryPrisma } from "@/infrastructure/repositories/prisma/AdminRepositoryPrisma";

const adminRepository = new AdminRepositoryPrisma(prisma);

const adminService = new AdminService(adminRepository);

const userDeleteController = new UserDeleteByIDController(adminService);

const userListController = new UserListController(adminService);

const userUpdateController = new UserUpdateController();

const adminRoutes: IAuthenticatedRoutes = [
  {
    path: "/admin/users/delete/id",
    method: "delete",
    controller: userDeleteController,
  },
  {
    path: "/admin/users/list",
    method: "get",
    controller: userListController,
  },
];

const userRoutes: IAuthenticatedRoutes = [
  {
    method: "patch",
    path: "/user/update",
    controller: userUpdateController,
  },
];

const authenticatedRoutes: IAuthenticatedRoutes = [
  ...adminRoutes,
  ...userRoutes,
];

export { authenticatedRoutes };
