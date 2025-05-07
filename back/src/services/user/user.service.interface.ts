import { UserLoginBody } from "../../util/validations/zod/user/user.login.zod.validation";

export type UserLoginOutputDto = {
  token: string | null;
};

export interface UserServiceInterface {
  generateUserLoginToken({
    email,
    password,
  }: UserLoginBody): Promise<UserLoginOutputDto>;
}
