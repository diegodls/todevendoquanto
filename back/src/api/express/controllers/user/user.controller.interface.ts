import { Response } from "express";
import { UserLoginBody } from "../../../../util/validations/zod/user/user.login.zod.validation";
import { ExpressCustomRequestBody } from "../express.custom.request.types";

export type LoginUserRequestBody = ExpressCustomRequestBody<UserLoginBody>;

export interface UserControllerInterface {
  login(req: LoginUserRequestBody, res: Response): Promise<void>;
}
