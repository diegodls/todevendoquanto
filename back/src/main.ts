import { ApiExpress } from "./api/express/api.express";
import { AdminController } from "./api/express/controllers/admin/admin.controller";
import { FindUserByEmailQueryParams } from "./api/express/controllers/admin/admin.controller.interface";
import { ProductController } from "./api/express/controllers/product/product.controller";
import { UserController } from "./api/express/controllers/user/user.controller";
import { AdminAuthMiddleware } from "./api/express/middleware/authorization/admin.authorization.middleware.express";
import { RequestBodyValidation } from "./api/express/middleware/validate/body.validate.middleware.express.zod";
import { UserRepositoryPrisma } from "./repositories/user/prisma/user.repository.prisma";
import { UserService } from "./services/user/user.service";
import { testDb } from "./util/db.health";
import { prisma } from "./util/orm/prisma/prisma.util";
import { CreateUserBodyZodSchema } from "./util/validations/zod/admin/admin.create-user.zod.validation";
import { UserLoginZodSchema } from "./util/validations/zod/user/user.login.zod.validation";

(async () => {
  testDb();
  const api = ApiExpress.build();

  const productController = ProductController.build();

  const adminController = AdminController.build();

  const repository = UserRepositoryPrisma.build(prisma);

  const service = new UserService(repository);

  const token = await service.generateUserLoginToken({
    email: "user001@email.com",
    password: "123456",
  });

  console.log("");
  console.log("🟦🔴🔴🔴🔴");
  console.log(token);

  const userController = UserController.build(service, repository);

  api.addGetRoute(
    "/test",
    (req, res, next) => {
      console.log("Hello");
      console.log("MIDDLEWARE-TEST");
      next();
    },
    async (req, res) => {
      console.log("🔴🔴 ROTA DE TESTE 🔴🔴");
      res.status(500).json({ message: "🔴🔴 ROTA DE TESTE 🔴🔴" }).send();
    }
  );

  // ! ADMIN ROUTES
  api.addGetRoute<{}, {}, FindUserByEmailQueryParams>(
    "/admin/users/findbyemail",
    adminController.findByEmail
  );

  api.addPostRoute(
    "/admin/users/create",
    AdminAuthMiddleware,
    RequestBodyValidation(CreateUserBodyZodSchema),
    adminController.create
  );

  // ! PRODUCT ROUTES
  api.addGetRoute("/products", productController.list);
  api.addPostRoute("/products/:id/buy", productController.buy);
  api.addPostRoute("/products/:id/sell", productController.sell);
  api.addPostRoute("/products/create", productController.create);

  // ! USER ROUTES
  api.addPostRoute(
    "/login",
    RequestBodyValidation(UserLoginZodSchema),
    userController.login
  );

  api.useErrorMiddleware();

  api.start(Number(process.env.PORT) || 3000);
})();
