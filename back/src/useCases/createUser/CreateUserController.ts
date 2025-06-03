import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";

export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async handle(request: Request, response: Response) {
    const { name, email, password } = request.body;

    await this.createUserUseCase.execute({ name, email, password });
  }
}
