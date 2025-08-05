import { DeleteUserByIDInputDTO } from "@/application/dtos/DeleteUserDTO";
import { z, ZodType } from "zod";

const DeleteUserByIDBodySchema: ZodType<DeleteUserByIDInputDTO> = z.object({
  id: z.string({
    required_error: "You must pass a ID",
    invalid_type_error: "You must pass a valid ID",
  }),
});

export { DeleteUserByIDBodySchema };
