import { z } from "zod";

const DeleteUserByIDBodySchema = z.object({
  id: z.string({
    required_error: "You must pass a ID",
    invalid_type_error: "You must pass a valid ID",
  }),
});

export { DeleteUserByIDBodySchema };
