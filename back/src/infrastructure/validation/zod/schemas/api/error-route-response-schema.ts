import { ApiErrorOutputDTO } from "@/core/ports/infrastructure/http/controllers/api/error-controller-interface";
import z from "zod";

export const ErrorRouteResponseSchema = z
  .object({
    where: z.enum(["controller", "service"]),
  })
  .strip() satisfies z.ZodType<ApiErrorOutputDTO>;
