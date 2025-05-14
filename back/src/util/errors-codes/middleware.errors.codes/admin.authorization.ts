import { MiddlewareErrorsCodesProps } from "../error.codes.interface";

const E_0_MW_ADM_0001: MiddlewareErrorsCodesProps = {
  instance: "admin.authorization.middleware.express",
  code: "E_0_MW_ADM_0001",
  details: "JWT doesn't exist on environment",
  actions: "Add JWT_PASS secret on .env",
};

const E_0_MW_ADM_0002: MiddlewareErrorsCodesProps = {
  instance: "admin.authorization.middleware.express",
  code: "E_0_MW_ADM_0002",
  details: "Authorization Bearer missing",
  actions: "Client side must send Bearer token",
};

const E_0_MW_ADM_0003: MiddlewareErrorsCodesProps = {
  instance: "admin.authorization.middleware.express",
  code: "E_0_MW_ADM_0003",
  details: "JWT verification fail",
  actions: "Client side must send a valid Bearer token",
};

const E_0_MW_ADM_0004: MiddlewareErrorsCodesProps = {
  instance: "admin.authorization.middleware.express",
  code: "E_0_MW_ADM_0004",
  details: "Token doesn't exists or not send",
  actions: "Client side must send Bearer token",
};

const E_0_MW_ADM_0005: MiddlewareErrorsCodesProps = {
  instance: "admin.authorization.middleware.express",
  code: "E_0_MW_ADM_0005",
  details: "Token expired",
  actions: "Client side must send new Bearer token",
};

const E_0_MW_ADM_0006: MiddlewareErrorsCodesProps = {
  instance: "admin.authorization.middleware.express",
  code: "E_0_MW_ADM_0006",
  details: "Generic error on JWT validation",
  actions: "Client side must send a valid Bearer token",
};

const E_0_MW_ADM_0007: MiddlewareErrorsCodesProps = {
  instance: "admin.authorization.middleware.express",
  code: "E_0_MW_ADM_0007",
  details: "Error on JWT validation time",
  actions: "Client side must send a valid Bearer token",
};

export const AdminMiddlewareErrorsCodes = {
  E_0_MW_ADM_0001,
  E_0_MW_ADM_0002,
  E_0_MW_ADM_0003,
  E_0_MW_ADM_0004,
  E_0_MW_ADM_0005,
  E_0_MW_ADM_0006,
  E_0_MW_ADM_0007,
};
