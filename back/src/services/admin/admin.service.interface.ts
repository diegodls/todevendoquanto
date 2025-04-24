import { UserPermissions, UserRole } from "../../entities/user";

export type CreateOutputDto = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions[];
};

export type FindByEmailOutputDto = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions[];
};

export interface AdminServiceInterface {
  create(
    name: string,
    email: string,
    password: string
  ): Promise<CreateOutputDto>;

  findByEmail(email: string): Promise<FindByEmailOutputDto>;
}
