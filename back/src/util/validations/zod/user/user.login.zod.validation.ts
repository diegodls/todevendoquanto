import { z } from "zod";

export const UserLoginZodSchema = z.object({
  email: z
    .string({
      required_error: "Must pass a valid email!",
      invalid_type_error: "Invalid type of email!",
    })
    .min(3, "Email has to be bigger than three caracteres!")
    .nonempty("Must pass a valid email!")
    .email({ message: "Must be a valide email!" }),
  password: z
    .string({
      required_error: "Must pass a valid password!",
      invalid_type_error: "Invalid type of password!",
    })
    .min(6, "Password has to be bigger than six caracteres!")
    .nonempty("Must pass a valid password!"),
});

export type UserLoginBody = z.infer<typeof UserLoginZodSchema>;
