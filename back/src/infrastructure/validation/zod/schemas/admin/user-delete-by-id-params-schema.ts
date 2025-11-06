import { UserDeleteByIDInputDTO } from "@/application/dtos/user/user-delete-dto";
import { z, ZodType } from "zod";

export const UserDeleteByIDParamsSchema = z
  .object({
    id: z.string({
      required_error: "You must pass a ID",
      invalid_type_error: "You must pass a valid ID",
    }),
  })
  .strip() satisfies ZodType<UserDeleteByIDInputDTO>;
