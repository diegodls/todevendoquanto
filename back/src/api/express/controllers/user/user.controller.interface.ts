import { Request, Response } from "express";

export type CustomRequestBody<T> = Request<{}, {}, T>;

export type CreateUserBody = {
  name: string;
  email: string;
  password: string;
};

export type CreateRequestBody = CustomRequestBody<CreateUserBody>;

export interface UserControllerContract {
  create(request: CreateRequestBody, response: Response): Promise<void>;
}
