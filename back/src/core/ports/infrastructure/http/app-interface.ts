import { Router } from "express";

export interface AppInterface {
  start(PORT: number): void;
  loadRoutes(router: Router): void;
}
