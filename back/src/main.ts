import { ApiExpress } from "./api/express/api.express";
import { ProductController } from "./api/express/controllers/product.controller";
import { UserController } from "./api/express/controllers/user/users.controller";

(() => {
  const api = ApiExpress.build();

  const productController = ProductController.build();

  const userController = UserController.build();

  api.addGetRoute("/test", async (req, res) => {
    console.log("🔴🔴 ROTA DE TESTE 🔴🔴");
    res.status(500).json({ message: "🔴🔴 ROTA DE TESTE 🔴🔴" }).send();
  });

  api.addGetRoute("/products", productController.list);
  api.addPostRoute("/products/:id/buy", productController.buy);
  api.addPostRoute("/products/:id/sell", productController.sell);
  api.addPostRoute("/products/create", productController.create);

  api.addPostRoute("/user/create", userController.create);

  api.useErrorMiddleware();

  api.start(Number(process.env.PORT) || 3000);
})();
