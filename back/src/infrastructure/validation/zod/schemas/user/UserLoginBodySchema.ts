import { z } from "zod";

const UserLoginBodySchema = z.object({
  email: z
    .string({
      invalid_type_error: "Must pass a valid email",
      required_error: "Must pass a valid email",
    })
    .email("Must pass a valid email"),
  password: z.string({
    required_error: "Must pass a valid password",
    invalid_type_error: "Must pass a valid password",
  }),
});

export { UserLoginBodySchema };
