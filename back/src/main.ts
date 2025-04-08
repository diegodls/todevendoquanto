import { ApiExpress } from "./infra/api/express/api.express";
import { CreateProductRoute } from "./infra/api/express/routes/product/create-product.express.route";
import { ListProductRoute } from "./infra/api/express/routes/product/list-product.express.route";
import { Route } from "./infra/api/express/routes/routes";
import { ProductRepositoryPrisma } from "./infra/repositories/prisma/product.repository";
import { prisma } from "./package/prisma/prisma";
import { CreateProductUsecase } from "./usecases/product/create-product-usecase";
import { ListProductUsecase } from "./usecases/product/list-product-usecase";

function main() {
  const port = 8000;

  const aRepository = ProductRepositoryPrisma.create(prisma);

  const createProductUsecase = CreateProductUsecase.create(aRepository);
  const listProductUsecase = ListProductUsecase.create(aRepository);

  const createRoute = CreateProductRoute.create(createProductUsecase);
  const listRoute = ListProductRoute.create(listProductUsecase);

  const routes: Route[] = [createRoute, listRoute];

  const api = ApiExpress.create(routes);

  api.start(port);
}

main();
