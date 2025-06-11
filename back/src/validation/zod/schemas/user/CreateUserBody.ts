import { z } from "zod";

const CreateUserBodySchema = z.object({
  name: z
    .string({
      description: "Insert a name",
      message: "Must pass a valid name!",
    })
    .nonempty("Must pass a valid ")
    .min(3, { message: "Name must have 3 or more caracteres" }),
  email: z.email("Invalid email!").nonempty("Must pass a valid email!"),
  password: z.string().min(6, "Password must have 6 or more caracteres"),
});

type CreateUserInputDTOZod = z.infer<typeof CreateUserBodySchema>;

export { CreateUserBodySchema, CreateUserInputDTOZod };
