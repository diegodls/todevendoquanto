import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDQueryInput,
} from "@/core/usecases/user/delete-user-dto";
import z from "zod";

export const UserDeleteByIDParamsSchema = z
  .object({
    id: z.string({
      error: (err) => {
        if (!err.input) return `You must pass a valid ${err.path}`;

        if (err.code === "invalid_type") return `Invalid type of ${err.path}`;

        if (err.code === "invalid_format")
          return `Invalid format of ${err.path}`;
      },
    }),
  })
  .strip() satisfies z.ZodType<
  DeleteUserByIDInputDTO,
  DeleteUserByIDQueryInput
>;
