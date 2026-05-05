import { UpdateUserOutputDTO } from "@/core/usecases/user/update-user-dto";
import z from "zod";

export const UpdateUserResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    isActive: z.boolean(),
  })
  .strip() satisfies z.ZodType<UpdateUserOutputDTO>;
