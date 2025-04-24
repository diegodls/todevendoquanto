import { ApiExpress } from "./api/express/api.express";
import { AdminController } from "./api/express/controllers/admin/admin.controller";
import { FindUserByEmailQueryParams } from "./api/express/controllers/admin/admin.controller.interface";
import { ProductController } from "./api/express/controllers/product.controller";
import { testDb } from "./util/db.health";

(async () => {
  testDb();

  const api = ApiExpress.build();

  const productController = ProductController.build();

  const adminController = AdminController.build();

  api.addGetRoute(
    "/test",
    (req, res, next) => {
      console.log("Hello");
      next();
    },
    async (req, res) => {
      console.log("🔴🔴 ROTA DE TESTE 🔴🔴");
      res.status(500).json({ message: "🔴🔴 ROTA DE TESTE 🔴🔴" }).send();
    }
  );

  api.addGetRoute("/products", productController.list);
  api.addPostRoute("/products/:id/buy", productController.buy);
  api.addPostRoute("/products/:id/sell", productController.sell);
  api.addPostRoute("/products/create", productController.create);

  api.addGetRoute<{}, {}, FindUserByEmailQueryParams>(
    "/admin/users",
    adminController.findByEmail
  );
  api.addPostRoute("/admin/users/create", adminController.create);

  api.useErrorMiddleware();

  api.start(Number(process.env.PORT) || 3000);
})();
