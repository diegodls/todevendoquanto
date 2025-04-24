import { Request, Response } from "express";

type CustomRequestBody<T> = Request<{}, {}, T>;

export type CreateUserBody = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserRequestBody = CustomRequestBody<CreateUserBody>;

type CustomRequestQueryParams<T> = Request<{}, {}, {}, T>;

export type FindUserByEmailQueryParams = {
  email: string;
};

export type FindUserByEmailRequestQueryParams =
  CustomRequestQueryParams<FindUserByEmailQueryParams>;

export interface AdminControllerInterface {
  create(req: Request, resp: Response): Promise<void>;
  findByEmail(
    req: FindUserByEmailRequestQueryParams,
    res: Response
  ): Promise<void>;
}
