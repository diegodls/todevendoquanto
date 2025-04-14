import { ApiExpress } from "./api/express/api.express";
import { ProductController } from "./api/express/controllers/product.controller";

(() => {
  const api = ApiExpress.build();

  const productController = ProductController.build();

  api.addGetRoute("/test-error", () => {
    throw new Error("ERROR TEST");
  });

  api.addGetRoute("/products", productController.list);
  api.addPostRoute("/products/:id/buy", productController.buy);
  api.addPostRoute("/products/:id/sell", productController.sell);
  api.addPostRoute("/products/create", productController.create);

  api.useErrorMiddleware();

  api.start(Number(process.env.PORT) || 3000);
})();
