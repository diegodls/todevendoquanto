import { User } from "../domain/User";

interface IUserLoginDecode {
  email: User["email"];
  role: User["role"];
  sub: User["id"];
  iat: number;
  exp: number;
}

interface AuthService {
  verifyToken(token: string): Promise<IUserLoginDecode>;
}

export { AuthService, IUserLoginDecode };
