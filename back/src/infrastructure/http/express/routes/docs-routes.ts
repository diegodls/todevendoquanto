import { DOCS_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import { generateOpenApiDocs } from "@/infrastructure/docs/generator";
import { ensureIsAdmin } from "@/infrastructure/http/express/middleware/ensure-is-admin";
import { ensureIsAuthenticated } from "@/infrastructure/http/express/middleware/ensure-is-authenticated";
import { JwtVerifyToken } from "@/infrastructure/protocols/jwt/jwt-verify-token";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";

const docsRouter = Router();

const jwtVerifyToken = new JwtVerifyToken();

const openApiDocs = generateOpenApiDocs();

docsRouter.use(
  DOCS_ROUTES_PATH.docs,
  swaggerUi.serve,
  swaggerUi.setup(openApiDocs)
);

docsRouter.use(ensureIsAuthenticated(jwtVerifyToken), ensureIsAdmin());

docsRouter.get(DOCS_ROUTES_PATH.json, (_request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.send(openApiDocs);
});

export { docsRouter };
