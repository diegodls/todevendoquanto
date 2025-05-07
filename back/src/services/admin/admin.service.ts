import bcrypt from "bcrypt";
import { User } from "../../entities/user";
import { AdminRepositoryInterface } from "../../repositories/admin/admin.repository.interface";
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
    console.log("EEEEEE");
    const userExists = await this.repository.findByEmail(email);

    console.log("FFFFFFF");

    if (userExists) {
      console.log("GGGGGGG");
      throw new CustomApiErrors.AlreadyExistError(
        `Usuário já existente com o email ${email}`
      );
    }

    console.log("HHHHH");
    const encryptedPassword = await bcrypt.hash(password, 10);

    console.log("");
    console.log("PASSWORD:");
    console.log(password);
    console.log("");
    console.log("EN.PASSWORD:");
    console.log(encryptedPassword);

    const data = User.create(name, email, encryptedPassword);

    const newUser = await this.repository.create(data);

    if (!newUser) {
      throw new CustomApiErrors.InternalError("Can't create user, try later!");
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
      throw new CustomApiErrors.NotFoundError(
        `Não foi encontrado usuário com o email ${email}`
      );
    }

    const { id, name, role, permissions } = userExists;

    const data = User.with(id, name, email, "", role, permissions);

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
