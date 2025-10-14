import { BadRequestError } from "@/core/shared/utils/errors/ApiError";

import { z } from "zod";

/* // ! 

const PAGINATION_DIRECTION: PaginationDirection[] = ["asc", "desc"];
// ! VER COMO USAR ISSO AQUI NO orderByZodSchema

const FORBIDDEN_SORT_FIELDS: UserInvalidKeysToOrderBy[] = ["id", "password"];

const orderByZodSchema = z
  .object({})
  .catchall(
    z
      .enum(["asc", "desc"], {
        invalid_type_error: "You must pass a valid type like asc or desc",
        message:
          "Error on validation order by, you need pass the order like asc or desc",
      })
      .optional()
  )
  .refine(
    (orderBy) => {
      const keys = Object.keys(orderBy) as UserInvalidKeysToOrderBy[];

      const hasForbiddenFields = keys.some((key) =>
        FORBIDDEN_SORT_FIELDS.includes(key)
      );

      return !hasForbiddenFields;
    },
    {
      message: "Unable to sort with the fields provided",
    }
  );


function createPaginationSchema<
  TOrderBy extends string,
  TOrderByValues extends readonly TOrderBy[]
>(
  orderByValues: TOrderByValues,
  defaultOrderBy: TOrderBy
): z.ZodType<PaginationInputParamsDTO<TOrderBy>> {
  return z.object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    order: orderByZodSchema.optional().default({ name: "asc" }),
    order_by: z.enum(orderByValues as any).default(defaultOrderBy),
  }) as any;
}
*/

function createPaginationSchema<T extends z.AnyZodObject>(
  filterSchema: T,
  defaultOrderBy: keyof z.infer<T>
) {
  type FilterKeys = keyof z.infer<T>;

  const validKeys = Object.keys(filterSchema.shape) as [
    FilterKeys,
    ...FilterKeys[]
  ];

  if (!validKeys.includes(defaultOrderBy)) {
    throw new BadRequestError(
      `The order field: ${String(defaultOrderBy)} is not valid`
    );
  }

  const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    order_by: z.string().default(defaultOrderBy as string),
  });

  return paginationSchema.merge(filterSchema);
}

export { createPaginationSchema };
