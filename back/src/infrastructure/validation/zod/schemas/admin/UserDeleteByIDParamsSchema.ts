import { UserDeleteByIDInputDTO } from "@/application/dtos/user/UserDeleteDTO";
import { z, ZodType } from "zod";

const UserDeleteByIDParamsSchema = z.object({
  id: z.string({
    required_error: "You must pass a ID",
    invalid_type_error: "You must pass a valid ID",
  }),
}) satisfies ZodType<UserDeleteByIDInputDTO>;

export { UserDeleteByIDParamsSchema };
