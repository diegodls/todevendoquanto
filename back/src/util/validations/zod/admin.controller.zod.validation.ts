import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z
    .string({
      required_error: "É necessário inserir um nome valido!",
      invalid_type_error: "O nome deve ser uma string!",
    })
    .min(3, { message: "O nome deve ter 3 ou mais caracteres" }),
  email: z
    .string({
      required_error: "É necessário inserir um email valido!",
      invalid_type_error: "O email deve ser uma string!",
    })
    .email({ message: "É necessário inserir um email valido!" }),
  password: z
    .string({
      required_error: "É necessário inserir uma senha valida!",
      invalid_type_error: "A senha deve ser uma string!",
    })
    .min(6, { message: "A senha deve ter 6 ou mais caracteres" }),
});

export type CreateUserBody = z.infer<typeof CreateUserSchema>;
