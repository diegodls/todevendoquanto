import { z } from "zod";

export const UserLoginZodSchema = z.object({
  email: z
    .string()
    .min(3, "Email has to be bigger than three caracteres!")
    .nonempty("Must pass a valid email!"),
  password: z
    .string()
    .min(6, "Password has to be bigger than six caracteres!")
    .nonempty("Must pass a valid password!"),
});

export type UserLoginBody = z.infer<typeof UserLoginZodSchema>;


PAREI AQUI, TEM QUE FAZER O LOGIN.EXCALIDRAW E CONTINUAR A ROTA DO LOGIN (CONTROLLER, SERVICE, REPOSITORY E TUDO QUE FOR NECESSÁRIO)