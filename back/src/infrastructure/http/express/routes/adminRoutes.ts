import { AdminService } from "@/application/services/admin/adminService";
import { IAdminRoutes } from "@/core/ports/infrastructure/http/routes/IAdminRoutes";
import { prisma } from "@/core/shared/utils/orm/prisma/prismaClient";
import { DeleteUserByIDController } from "@/infrastructure/http/express/controllers/admin/DeleteUserByIDController";
import { ListUsersController } from "@/infrastructure/http/express/controllers/admin/ListUsersController";
import { AdminRepository } from "@/infrastructure/repositories/prisma/AdminRepository";

const adminRepository = new AdminRepository(prisma);

const adminService = new AdminService(adminRepository);

const deleteUserController = new DeleteUserByIDController(adminService);

const listUsersController = new ListUsersController(adminService);

const adminRoutes: IAdminRoutes = [
  {
    path: "/admin/users/delete/id",
    method: "delete",
    controller: deleteUserController,
  },
  {
    path: "/admin/users/list",
    method: "get",
    controller: listUsersController,
  },
];

export { adminRoutes };
