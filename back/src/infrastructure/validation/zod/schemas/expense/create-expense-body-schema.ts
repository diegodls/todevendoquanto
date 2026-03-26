import { CreateExpenseBodyInput } from "@/core/usecases/expense/create-expense-dto";
import { zodDefaultErrorHandler } from "@/infrastructure/validation/zod/helpers/zod-default-error-handler";
import { DateSchema } from "@/infrastructure/validation/zod/schemas/shared/date-schema";
import z from "zod";

const defaultToday = () => {
  const defaultHourDrift = 12;
  // prevent drift, local 01/01/2026 11:00:00 ~> cloud 02/01/2026 00:00:00
  const now = new Date();
  now.setHours(defaultHourDrift, 0, 0);
  return now;
};

export const CreateExpenseBodySchema = z
  .object({
    name: z.string().optional(),

    description: z.string().optional(),

    totalAmount: z.number().optional(),

    currency: z.string().optional(),

    status: z.string().toUpperCase().optional(),

    tags: z
      .array(
        z.string({
          error: zodDefaultErrorHandler,
        }),
      )
      .optional(),

    totalInstallment: z
      .number({
        error: zodDefaultErrorHandler,
      })
      .optional(),

    paymentDay: DateSchema.optional(),

    expirationDay: DateSchema.optional(),

    paymentStartAt: DateSchema.optional(),

    paymentEndAt: DateSchema.optional(),
  })
  .strip() satisfies z.ZodType<CreateExpenseBodyInput>;
