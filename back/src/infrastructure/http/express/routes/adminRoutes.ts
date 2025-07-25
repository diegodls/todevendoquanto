import { AdminService } from "@/application/services/admin/adminService";
import { IAdminRoutes } from "@/core/ports/infrastructure/http/routes/IAdminRoutes";
import { prisma } from "@/core/shared/utils/orm/prisma/prismaClient";
import { DeleteUserController } from "@/infrastructure/http/express/controllers/admin/DeleteUserController";
import { AdminRepository } from "@/infrastructure/repositories/prisma/AdminRepository";

const adminRepository = new AdminRepository(prisma);

const adminService = new AdminService(adminRepository);

const deleteUserController = new DeleteUserController(adminService);

const adminRoutes: IAdminRoutes = [
  {
    path: "/admin/users/delete/id",
    method: "delete",
    handler: deleteUserController,
  },
];

export { adminRoutes };
