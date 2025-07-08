import { DeleteUserController } from "../../controllers/express/admin/DeleteUserController";
import { AdminRepository } from "../../repositories/prisma/AdminRepository";
import { AdminService } from "../../services/admin/adminService";
import { prisma } from "../../utils/orm/prisma/prismaClient";
import { IAdminRoutes } from "./IAdminRoutes";

const adminRepository = new AdminRepository(prisma);

const adminService = new AdminService(adminRepository);

const deleteUserController = new DeleteUserController(adminService);

const adminRoutes: IAdminRoutes = [
  {
    path: "/admin/deleteUser",
    method: "delete",
    handler: deleteUserController,
  },
];

export { adminRoutes };
