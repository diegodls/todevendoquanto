import { User } from "../../entities/user";
import { AdminRepositoryInterface } from "../../repositories/admin/admin.repository";
import { CustomApiErrors } from "../../util/api.errors";
import {
  AdminServiceInterface,
  CreateOutputDto,
  FindByEmailOutputDto,
} from "./admin.service.interface";

export class AdminService implements AdminServiceInterface {
  private constructor(readonly repository: AdminRepositoryInterface) {}

  public static build(repository: AdminRepositoryInterface) {
    return new AdminService(repository);
  }

  public async create(
    name: string,
    email: string,
    password: string
  ): Promise<CreateOutputDto> {
    const userExists = await this.repository.findByEmail(email);

    if (userExists) {
      throw new CustomApiErrors.AlreadyExistError(
        `Usuário já existente com o email ${email}`
      );
    }

    const data = User.create(name, email, password);

    const newUser = await this.repository.create(data);

    if (!newUser) {
      throw new Error(`${newUser}`);
    }

    const output: CreateOutputDto = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      permissions: data.permissions,
    };

    return output;
  }

  public async findByEmail(email: string): Promise<FindByEmailOutputDto> {
    const userExists = await this.repository.findByEmail(email);

    if (!userExists) {
      throw new CustomApiErrors.ErrorNotFound(
        `Não foi encontrado usuário com o email ${email}`
      );
    }

    const { id, name, role, permissions } = userExists;

    const data = User.with(id, name, email, role, permissions);

    const output: CreateOutputDto = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      permissions: data.permissions,
    };

    return output;
  }
}
