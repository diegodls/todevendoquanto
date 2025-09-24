import { z } from "zod";

const UserUpdateBodySchema = z.object({
  name: z.string().min(6).max(256).optional(),
  email: z.string().email().optional(),
});

export { UserUpdateBodySchema };
