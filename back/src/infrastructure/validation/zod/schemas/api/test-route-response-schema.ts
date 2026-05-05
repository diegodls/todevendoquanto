import { TestControllerOutputDTO } from "@/core/ports/infrastructure/http/controllers/api/test-controller-interface";
import z from "zod";

export const TestRouteResponseSchema = z
  .object({
    message: z.string(),
  })
  .strip() satisfies z.ZodType<TestControllerOutputDTO>;
