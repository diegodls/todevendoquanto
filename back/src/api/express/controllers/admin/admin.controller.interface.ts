import { Request, Response } from "express";
import { CreateUserBody } from "../../../../util/validations/zod/admin/admin.create-user.zod.validation";
import {
  ExpressCustomRequestBody,
  ExpressCustomRequestQuery,
} from "../express.custom.request.types";

export type CreateUserRequestBody = ExpressCustomRequestBody<CreateUserBody>;

export type FindUserByEmailQueryParams = {
  email: string;
};

export type FindUserByEmailRequestQueryParams =
  ExpressCustomRequestQuery<FindUserByEmailQueryParams>;

export interface AdminControllerInterface {
  create(req: Request, resp: Response): Promise<void>;
  findByEmail(
    req: FindUserByEmailRequestQueryParams,
    res: Response
  ): Promise<void>;
}
