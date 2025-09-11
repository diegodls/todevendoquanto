import { PaginationInputDTO } from "@/application/dtos/PaginationDTO";
import { z, ZodType } from "zod";

const ListUsersBodySchema: ZodType<PaginationInputDTO> = z.object({
  page: z.number({
    invalid_type_error: "You must pass a valid page number",
  }),
  page_size: z.number({
    invalid_type_error: "You must pass a valid page size",
  }),
});

export { ListUsersBodySchema };
