import { Request, Response } from "express";

export type CustomRequestBody<T> = Request<{}, {}, T>;

export type CreateUserBody = {
  name: string;
  email: string;
  password: string;
};

export type CreateRequestBody = CustomRequestBody<CreateUserBody>;

export type FindByEmailBody = {
  email: string;
};

export type FindByRequestBody = CustomRequestBody<FindByEmailBody>;

export interface UserControllerContract {
  create(req: CreateRequestBody, resp: Response): Promise<void>;
  findByEmail(req: FindByEmailBody, res: Response): Promise<void>;
}
