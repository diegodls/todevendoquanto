import { ApiErrorInputDTO } from "@/core/ports/infrastructure/http/controllers/api/error-controller-interface";
import z from "zod";

export const ErrorRouteBodySchema = z
  .object({
    where: z
      .enum(["controller", "service"])
      .optional()
      .describe(
        "Use 'controller' or 'service' to force an internal error for tests.",
      ),
  })
  .strip() satisfies z.ZodType<Partial<ApiErrorInputDTO>>;
