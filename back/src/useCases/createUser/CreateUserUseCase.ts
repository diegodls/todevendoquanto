import { User } from "../../entities/User";
import { IMailProvider, IMessage } from "../../providers/IMailProvider";
import { IUserRepository } from "../../repositories/IUserRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";
/*
o uso do private no constructor remove a necessidade de
passar o userRepository como props e criar um private
isto é, cria automaticamente com a props passada:
    private userRepository: IUserRepository
    constructor(userRepository: IUserRepository) {}
    this.userRepository = userRepository
*/
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailProvider: IMailProvider
  ) {}
  async execute(data: ICreateUserRequestDTO) {
    const alreadyExists = await this.userRepository.findByEmail(data.email);

    if (!alreadyExists) {
      throw new Error("User already exists");
    }
    const user = new User(data);

    await this.userRepository.save(user);

    const mailMessageData: IMessage = {
      to: { name: user.name, email: user.email },
      from: { name: "Equipe do APP", email: "test@test.com" },
      subject: `Seja bem vindo ao APP ${crypto.randomUUID}`,
      body: `<p>Seja bem vindo ${user.name} ao APP ${crypto.randomUUID}</p>`,
    };

    this.mailProvider.sendMail(mailMessageData);
  }
}
