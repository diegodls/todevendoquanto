import express, { Express, Request, Response } from "express";
import { Api } from "../api";

export class ApiExpress implements Api {
  private constructor(app: Express) {}

  public static build() {
    const app = express();

    app.use(express.json());

    return new ApiExpress(app);
  }

  public static addGetRoute(
    path: string,
    handle: (req: Request, res: Response) => Promise<void>
  ) {}
}

//! parei 1:07:00 RY0BQV803UU
