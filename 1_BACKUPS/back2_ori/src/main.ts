import { ApiExpress } from "./api/express/ApiExpress";
import { ProductController } from "./api/express/controllers/product.controller";

function main() {
  const api = ApiExpress.build();

  const productController = ProductController.build();

  api.addGetRoute("/products", productController.list);
  api.addPostRoute("/products/:id/buy", productController.buy);
  api.addPostRoute("/products/:id/sell", productController.sell);
  api.addPostRoute("/products/create", productController.create);

  api.start(3000);
}

main();
