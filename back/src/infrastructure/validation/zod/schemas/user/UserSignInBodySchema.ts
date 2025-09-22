import { z } from "zod";

const UserSignInBodySchema = z.object({
  name: z
    .string({
      description: "Insert a name",
      message: "Must pass a valid name!",
    })
    .nonempty("Must pass a valid ")
    .min(3, { message: "Name must have 3 or more caracteres" }),
  email: z
    .string({
      invalid_type_error: "Must pass a valid email!",
      required_error: "Must pass a valid email!",
    })
    .email({ message: "Must pass a valid email!" })
    .nonempty("Must pass a valid email!"),
  password: z
    .string()
    .nonempty("Must pass a valid password!")
    .min(6, "Password must have 6 or more caracteres"),
});

export { UserSignInBodySchema };
