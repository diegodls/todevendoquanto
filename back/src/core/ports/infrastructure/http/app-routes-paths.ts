export type RoutePathType = `/${string}`;

export interface RouteMap {
  [key: string]: RoutePathType;
}

export const APP_ROUTES_ROOT_PATH = "/api/v1" satisfies RoutePathType;

export const AUTH_ROUTES_PATH = {
  root: "/",
  login: "/login",
} satisfies RouteMap;

export const USER_ROUTES_PATH = {
  root: "/users",
  login: "/login",
  update: "/update/:id",
  list: "/",
  create: "/create",
  delete: "/delete/:id",
} satisfies RouteMap;

export const API_ROUTES_PATH = {
  root: "/api",
  test: "/test",
  error: "/error",
};

export const DOCS_ROUTES_PATH = {
  root: "/",
  docs: "/docs",
  json: "/docs/json",
} satisfies RouteMap;

export const EXPENSE_ROUTES_PATH = {
  root: "/expenses",
  create: "/create",
  delete: "/delete/:id",
};
