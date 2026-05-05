import { CreateUserOutputDTO } from "@/core/usecases/user/create-user-dto";
import z from "zod";

export const CreateUserResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    createdAt: z.string(),
    isActive: z.boolean(),
  })
  .strip() satisfies z.ZodType<CreateUserOutputDTO>;
