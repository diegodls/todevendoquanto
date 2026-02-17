import { ListUsersFilterProps } from "@/core/usecases/user/list-user-dto";
import { PrismaGenerated } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { GenericFilterMapper } from "@/infrastructure/repositories/prisma/utils/query-filter-to-prisma-where";

export const listUsersFilters: GenericFilterMapper<
  ListUsersFilterProps,
  PrismaGenerated.UserWhereInput
> = {
  name: (value) => ({
    name: {
      contains: value,
      mode: "insensitive",
    },
  }),
  email: (value) => ({
    email: {
      equals: value,
      mode: "insensitive",
    },
  }),
  isActive: (value) => ({ isActive: value }),
  roles: (value) => ({
    role: {
      in: value,
    },
  }),
  created_after: (value) => ({
    createdAt: { gte: new Date(value) },
  }),
  created_before: (value) => ({
    createdAt: { lte: new Date(value) },
  }),
  updated_after: (value) => ({
    updatedAt: { gte: new Date(value) },
  }),
  updated_before: (value) => ({
    updatedAt: { lte: new Date(value) },
  }),
};
