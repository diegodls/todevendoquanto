import {
  ListExpenseFiltersOptionsParams,
  ListExpenseFiltersOptionsProps,
  ListExpenseOrderByOptionsArrKey,
  ListExpenseOrderDirectionOptions,
  ListExpenseOrderRequestOptionalProps,
  ListExpenseOrderRequestOptionsParams,
} from '@/core/usecases/expense/list-expense-dto';
import { toZodEnum } from '@/infrastructure/validation/zod/helpers/to-zod-enum';
import { DateSchema } from '@/infrastructure/validation/zod/schemas/shared/date-schema';
import { PaginationSchema } from '@/infrastructure/validation/zod/schemas/shared/pagination-schema';
import z from 'zod';

const ListExpenseFilterOptionsSchema = z
  .object({
    name: z.string().optional(),
    installmentId: z.string().optional(),
    created_before: DateSchema.optional(),
    created_after: DateSchema.optional(),
    updated_before: DateSchema.optional(),
    updated_after: DateSchema.optional(),
    description: z.string().optional(),
    currency: z
      .string()
      .transform((value) => value.toUpperCase().split(','))
      .optional(),
    amount_min: z
      .string()
      .transform((value) => parseFloat(value))
      .optional(),
    amount_max: z
      .string()
      .transform((value) => parseFloat(value))
      .optional(),
    totalAmount_min: z
      .string()
      .transform((value) => parseFloat(value))
      .optional(),
    totalAmount_max: z
      .string()
      .transform((value) => parseFloat(value))
      .optional(),
    status: z
      .string()
      .transform((value) => value.toUpperCase().split(','))
      .optional(),
    tags: z
      .string()
      .transform((value) => value.toUpperCase().split(','))
      .optional(),
    currentInstallment: z
      .string()
      .transform((value) => parseInt(value))
      .optional(),
    totalInstallment: z
      .string()
      .transform((value) => parseInt(value))
      .optional(),
    paymentDay_before: DateSchema.optional(),
    paymentDay_after: DateSchema.optional(),
    expirationDay_before: DateSchema.optional(),
    expirationDay_after: DateSchema.optional(),
    paymentStartAt_before: DateSchema.optional(),
    paymentStartAt_after: DateSchema.optional(),
    paymentEndAt_before: DateSchema.optional(),
    paymentEndAt_after: DateSchema.optional(),
  })
  .strip() satisfies z.ZodType<
  ListExpenseFiltersOptionsProps,
  ListExpenseFiltersOptionsParams
>;

const ListExpenseOrderOptionsSchema = z
  .object({
    order: z.string().pipe(z.enum(ListExpenseOrderDirectionOptions)).optional(),

    orderBy: z
      .string()
      .pipe(z.enum(toZodEnum(ListExpenseOrderByOptionsArrKey)))
      .optional(),
  })
  .strip() satisfies z.ZodType<
  ListExpenseOrderRequestOptionalProps,
  ListExpenseOrderRequestOptionsParams
>;

const ListExpenseRequestProps = ListExpenseFilterOptionsSchema.safeExtend(
  ListExpenseOrderOptionsSchema.shape,
);

export const ListExpenseSchema = ListExpenseRequestProps.safeExtend(
  PaginationSchema.shape,
);
