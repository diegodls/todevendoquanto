import { z, ZodType } from "zod";
import { DeleteUserInputDTO } from "../../../../entities/User";

const DeleteUserByIDBodySchema: ZodType<DeleteUserInputDTO> = z.object({
  idToDelete: z.string(),
});

export { DeleteUserByIDBodySchema };
