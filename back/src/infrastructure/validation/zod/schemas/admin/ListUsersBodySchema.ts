import {
  ListUsersControllerFilters,
  PaginationInputDTO,
} from "@/application/dtos/PaginationDTO";
import { User } from "@/core/domain/User";
import { z, ZodType } from "zod";

const ListUsersBodySchema: ZodType<
  PaginationInputDTO<User, ListUsersControllerFilters>
> = z.object({
  page: z
    .number({
      invalid_type_error: "You must pass a valid page number",
    })
    .min(1, "You must pass a valid page number higher than 1.")
    .default(1),
  page_size: z
    .number({
      invalid_type_error: "You must pass a valid page size",
    })
    .min(1, "You must pass a valid page size number higher than 1.")
    .max(100, "You must pass a valid page number lower than 100.")
    .default(10),
  filters: z.object({}).optional(),
});

export { ListUsersBodySchema };
